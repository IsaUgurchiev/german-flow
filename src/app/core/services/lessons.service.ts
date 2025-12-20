import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, catchError, of } from 'rxjs';
import { LessonMeta } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  private http = inject(HttpClient);
  private readonly lessonsUrl = 'assets/lessons/lessons.json';

  // Cache lessons once loaded
  private lessonsCache$: Observable<LessonMeta[]> = this.http.get<LessonMeta[]>(this.lessonsUrl).pipe(
    catchError(error => {
      console.error('Error loading lessons registry:', error);
      return of([]);
    }),
    shareReplay(1)
  );

  /**
   * Returns all available lessons.
   */
  getAllLessons(): Observable<LessonMeta[]> {
    return this.lessonsCache$;
  }

  /**
   * Returns a specific lesson by ID.
   */
  getLessonById(id: string): Observable<LessonMeta | null> {
    return this.lessonsCache$.pipe(
      map(lessons => lessons.find(l => l.id === id) || null)
    );
  }
}

