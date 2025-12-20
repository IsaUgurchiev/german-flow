import { Injectable, inject } from '@angular/core';
import { SubtitleLine } from './subtitle.service';
import { FillBlankService, FillBlankExercise } from './fill-blank.service';

export interface FillBlankSetItem extends FillBlankExercise {
  id: string;
  sourceText: string;
}

@Injectable({
  providedIn: 'root',
})
export class FillBlankSetService {
  private fillBlankService = inject(FillBlankService);

  /**
   * Generates a set of random fill-in-the-blank exercises from lesson subtitles.
   * Selection rules:
   * - pick UNIQUE subtitle lines
   * - only lines that produce a valid exercise (answer not empty)
   * - return up to 10 random tasks
   */
  generateExerciseSet(lines: SubtitleLine[]): FillBlankSetItem[] {
    if (!lines || lines.length === 0) return [];

    // Filter lines that can produce a valid exercise
    const validCandidates = lines
      .map((line, index) => {
        const exercise = this.fillBlankService.generateExercise(line.text);
        if (exercise && exercise.answer) {
          return {
            id: `${line.start}-${line.end}-${index}`,
            sourceText: line.text,
            ...exercise,
          };
        }
        return null;
      })
      .filter((item): item is FillBlankSetItem => item !== null);

    if (validCandidates.length === 0) return [];

    // Random sample up to 10 items
    const shuffled = [...validCandidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }
}

