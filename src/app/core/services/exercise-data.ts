import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { McqExercise } from '../../features/exercises/models/exercise.model';
import { LessonsService } from './lessons.service';

export type ExerciseType = 'word_translation_mcq' | 'sentence_translation_mcq' | 'comprehension_mcq' | 'fill_blank';

export interface ExerciseItem extends McqExercise {
  id: string;
}

export interface ExerciseSet {
  type: ExerciseType;
  items: ExerciseItem[];
}

export interface ExerciseData {
  lessonId: string;
  exerciseSets: ExerciseSet[];
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseDataService {
  private http = inject(HttpClient);
  private lessonsService = inject(LessonsService);

  getExercisesForLesson(lessonId: string): Observable<ExerciseData | null> {
    return this.lessonsService.getLessonById(lessonId).pipe(
      switchMap(lesson => {
        if (!lesson || !lesson.exercisesSrc) {
          console.warn(`No exercises found for lesson ${lessonId}`);
          return of(null);
        }
        
        return this.http.get<ExerciseData>(lesson.exercisesSrc).pipe(
          catchError(error => {
            console.error('Error loading exercises:', error);
            return of(null);
          })
        );
      })
    );
  }
}
