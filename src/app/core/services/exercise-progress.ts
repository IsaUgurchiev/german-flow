import { Injectable } from '@angular/core';

export interface ExerciseAttempt {
  exerciseId: string;
  exerciseType: string;
  lessonId: string;
  isCorrect: boolean;
  selectedIndex?: number;
  userAnswer?: string;
  ts: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseProgressService {
  private readonly STORAGE_KEY = 'gf.exercise_attempts';

  saveAttempt(attempt: ExerciseAttempt): void {
    const attempts = this.getAttempts();
    // Only keep the latest attempt for each exercise to prevent multiple entries
    const index = attempts.findIndex(a => a.exerciseId === attempt.exerciseId);
    if (index !== -1) {
      attempts[index] = attempt;
    } else {
      attempts.push(attempt);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempts));
  }

  getAttempts(): ExerciseAttempt[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  getAttempt(exerciseId: string): ExerciseAttempt | undefined {
    return this.getAttempts().find(a => a.exerciseId === exerciseId);
  }

  isCompleted(exerciseId: string): boolean {
    return this.getAttempts().some(a => a.exerciseId === exerciseId && a.isCorrect);
  }
}
