import { Injectable, inject, effect, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { XpService, XpLogEntry } from './xp.service';
import { MyWordsRepository } from '../repositories/my-words.repository';
import { UserProgressService } from './user-progress.service';
import { environment } from '../../../environments/environment';
import { catchError, of, Subject, debounceTime, switchMap, filter } from 'rxjs';

export interface UserState {
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

  private syncSubject = new Subject<void>();

  constructor() {
    // 1. Pull on login
    effect(() => {
      if (this.auth.isAuthenticated()) {
        untracked(() => this.pullState());
      }
    });

    // 2. Watch for changes to signal push
    effect(() => {
      // Access signals to track them
      this.xpService.totalXp();
      this.xpService.xpLog();
      this.wordsRepo.getAll();
      this.progressService.lastLessonId();
      
      untracked(() => this.syncSubject.next());
    });

    // 3. Push on change (debounced)
    this.syncSubject.pipe(
      debounceTime(2000), // 2 seconds debounce
      filter(() => this.auth.isAuthenticated()),
      switchMap(() => this.pushState())
    ).subscribe();
  }

  private pullState() {
    this.http.get<UserState>(`${environment.apiBaseUrl}/state`).pipe(
      catchError(() => of(null))
    ).subscribe(state => {
      if (state) {
        untracked(() => this.hydrateLocalState(state));
      }
    });
  }

  private pushState() {
    const state: UserState = {
      totalXp: this.xpService.getXp(),
      xpLog: this.xpService.getLog(),
      myWords: this.wordsRepo.getAll(),
      lastLessonId: this.progressService.lastLessonId()
    };

    return this.http.post(`${environment.apiBaseUrl}/state`, state).pipe(
      catchError(() => of(null))
    );
  }

  private hydrateLocalState(state: UserState) {
    // XP
    this.xpService.hydrate(state.totalXp, state.xpLog);
    
    // Words
    this.wordsRepo.hydrate(state.myWords);
    
    // Last lesson
    this.progressService.hydrate(state.lastLessonId);
  }
}

