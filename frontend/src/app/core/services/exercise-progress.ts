import { Injectable, signal, computed } from '@angular/core';

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
  
  // Use a signal for attempts to allow reactive updates across the app
  private attemptsSignal = signal<ExerciseAttempt[]>(this.loadFromStorage());

  private loadFromStorage(): ExerciseAttempt[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  saveAttempt(attempt: ExerciseAttempt): void {
    const currentAttempts = this.attemptsSignal();
    const index = currentAttempts.findIndex(a => a.exerciseId === attempt.exerciseId);
    
    let newAttempts: ExerciseAttempt[];
    if (index !== -1) {
      newAttempts = [...currentAttempts];
      newAttempts[index] = attempt;
    } else {
      newAttempts = [...currentAttempts, attempt];
    }
    
    this.attemptsSignal.set(newAttempts);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newAttempts));
  }

  /**
   * Hydrates the service state from backend data.
   * This is called by SyncService after a successful pull.
   */
  hydrate(attempts: ExerciseAttempt[]): void {
    if (!attempts) return;
    this.attemptsSignal.set(attempts);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attempts));
  }

  getAttempts(): ExerciseAttempt[] {
    return this.attemptsSignal();
  }

  getAttempt(exerciseId: string): ExerciseAttempt | undefined {
    return this.attemptsSignal().find(a => a.exerciseId === exerciseId);
  }

  isCompleted(exerciseId: string): boolean {
    return this.attemptsSignal().some(a => a.exerciseId === exerciseId && a.isCorrect);
  }
}
