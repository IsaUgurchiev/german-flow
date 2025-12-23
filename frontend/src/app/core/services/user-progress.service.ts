import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {
  private readonly LAST_LESSON_KEY = 'gf.last.lessonId';
  
  lastLessonId = signal<string | null>(localStorage.getItem(this.LAST_LESSON_KEY));

  setLastLessonId(id: string) {
    this.lastLessonId.set(id);
    localStorage.setItem(this.LAST_LESSON_KEY, id);
  }

  hydrate(lastLessonId: string | null) {
    if (lastLessonId) {
      this.lastLessonId.set(lastLessonId);
      localStorage.setItem(this.LAST_LESSON_KEY, lastLessonId);
    }
  }
}

