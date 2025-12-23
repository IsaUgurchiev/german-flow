import { Injectable, inject, effect, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { XpService, XpLogEntry } from './xp.service';
import { MyWordsRepository } from '../repositories/my-words.repository';
import { UserProgressService } from './user-progress.service';
import { environment } from '../../../environments/environment';
import { catchError, of, Subject, debounceTime, switchMap, filter, tap } from 'rxjs';

export interface UserStatePayload {
  totalXp: number;
  xpLog: XpLogEntry[];
  myWords: string[];
  lastLessonId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private xpService = inject(XpService);
  private wordsRepo = inject(MyWordsRepository);
  private progressService = inject(UserProgressService);

  private pushSubject = new Subject<void>();
  private isHydrating = false;
  private lastPushedPayloadString: string | null = null;

  constructor() {
    // 1. Pull on login
    effect(() => {
      if (this.auth.isAuthenticated()) {
        console.log('SyncService: User logged in, triggering pull...');
        untracked(() => this.pullState());
      }
    });

    // 2. Watch for local changes to trigger PUSH
    effect(() => {
      // Access signals to track them
      this.xpService.totalXp();
      this.xpService.xpLog();
      this.wordsRepo.getAll();
      this.progressService.lastLessonId();

      if (this.isHydrating) return;

      if (this.auth.isAuthenticated()) {
        untracked(() => {
          this.pushSubject.next();
        });
      } else {
        // Track local changes while unauthenticated to trigger merge on next login
        untracked(() => {
          localStorage.setItem('gf.sync.localDirty', '1');
          console.log('SyncService: Local change detected while logged out. Flagging for merge.');
        });
      }
    });

    // 3. Handle debounced PUSH
    this.pushSubject.pipe(
      debounceTime(2000),
      filter(() => this.auth.isAuthenticated() && !this.isHydrating),
      switchMap(() => this.pushState())
    ).subscribe();
  }

  private pullState() {
    this.isHydrating = true;
    this.http.get<UserStatePayload>(`${environment.apiBaseUrl}/state`).pipe(
      tap(() => console.log('SyncService: Pull success')),
      catchError(err => {
        console.warn('SyncService: Pull failed', err);
        return of(null);
      })
    ).subscribe(serverState => {
      if (serverState) {
        const isLocalDirty = localStorage.getItem('gf.sync.localDirty') === '1';
        
        if (isLocalDirty) {
          console.log('SyncService: Merging local progress into account...');
          const localState: UserStatePayload = {
            totalXp: this.xpService.getXp(),
            xpLog: this.xpService.getLog(),
            myWords: this.wordsRepo.getAll(),
            lastLessonId: this.progressService.lastLessonId()
          };

          const mergedState = this.mergeStates(serverState, localState);
          
          untracked(() => {
            this.xpService.hydrate(mergedState.totalXp, mergedState.xpLog);
            this.wordsRepo.hydrate(mergedState.myWords);
            this.progressService.hydrate(mergedState.lastLessonId);
            this.lastPushedPayloadString = JSON.stringify(mergedState);
            
            // Immediate push of merged state to server
            this.http.post(`${environment.apiBaseUrl}/state`, mergedState).pipe(
              tap(() => console.log('SyncService: Merged state pushed successfully')),
              catchError(() => of(null))
            ).subscribe();
          });

          localStorage.removeItem('gf.sync.localDirty');
        } else {
          untracked(() => {
            this.xpService.hydrate(serverState.totalXp, serverState.xpLog || []);
            this.wordsRepo.hydrate(serverState.myWords || []);
            this.progressService.hydrate(serverState.lastLessonId);
            
            // Store the pulled state as the "last pushed" to prevent immediate loop
            this.lastPushedPayloadString = JSON.stringify(serverState);
          });
        }
      }
      
      // Release hydration lock asynchronously to allow signals to settle
      setTimeout(() => {
        this.isHydrating = false;
        console.log('SyncService: Hydration lock released');
      }, 0);
    });
  }

  private mergeStates(server: UserStatePayload, local: UserStatePayload): UserStatePayload {
    // 1. Total XP: use max to ensure no loss
    const totalXp = Math.max(server.totalXp || 0, local.totalXp || 0);

    // 2. My Words: union of unique words
    const myWords = Array.from(new Set([
      ...(server.myWords || []),
      ...(local.myWords || [])
    ]));

    // 3. Last Lesson: local preferred if exists
    const lastLessonId = local.lastLessonId || server.lastLessonId;

    // 4. XP Log: concatenate and de-duplicate by timestamp
    const combinedLog = [...(server.xpLog || []), ...(local.xpLog || [])];
    const uniqueLogMap = new Map<number, XpLogEntry>();
    combinedLog.forEach(entry => uniqueLogMap.set(entry.ts, entry));
    
    const xpLog = Array.from(uniqueLogMap.values())
      .sort((a, b) => b.ts - a.ts) // Newest first
      .slice(0, 50);

    return { totalXp, xpLog, myWords, lastLessonId };
  }

  private pushState() {
    if (this.isHydrating) return of(null);

    const payload: UserStatePayload = {
      totalXp: this.xpService.getXp(),
      xpLog: this.xpService.getLog(),
      myWords: this.wordsRepo.getAll(),
      lastLessonId: this.progressService.lastLessonId()
    };

    const payloadString = JSON.stringify(payload);
    
    // Skip if payload hasn't changed since last successful PULL or PUSH
    if (payloadString === this.lastPushedPayloadString) {
      console.log('SyncService: Skipping push, payload unchanged');
      return of(null);
    }

    return this.http.post(`${environment.apiBaseUrl}/state`, payload).pipe(
      tap(() => {
        console.log('SyncService: Push success');
        this.lastPushedPayloadString = payloadString;
      }),
      catchError(err => {
        console.warn('SyncService: Push failed', err);
        return of(null);
      })
    );
  }
}
