import { Injectable, inject, computed } from '@angular/core';
import { XpService } from './xp.service';
import { MyWordsRepository } from '../repositories/my-words.repository';

export interface ProgressSummary {
  totalXp: number;
  savedWordsCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressSummaryService {
  private xpService = inject(XpService);
  private myWordsRepository = inject(MyWordsRepository);

  getSummary(): ProgressSummary {
    return {
      totalXp: this.xpService.getXp(),
      savedWordsCount: this.myWordsRepository.getAll().length
    };
  }
}

