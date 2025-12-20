import { Injectable } from '@angular/core';
import { SubtitleLine } from './subtitle.service';
import { STOP_WORDS_DE } from '../../shared/utils/stop-words.de';

export interface VocabItem {
  word: string;
  count: number;
  example: string;
}

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  /**
   * Extracts potential vocabulary words from subtitle lines.
   * Filters out stop words, punctuation, and short words.
   */
  extractPotentialWords(lines: SubtitleLine[]): VocabItem[] {
    const wordStats = new Map<string, { count: number; example: string }>();

    lines.forEach(line => {
      // Remove punctuation and split by whitespace
      const words = line.text
        .toLowerCase()
        .replace(/[.,!?;:()"]/g, '')
        .split(/\s+/);

      words.forEach(word => {
        if (this.isValidWord(word)) {
          const stats = wordStats.get(word) || { count: 0, example: line.text };
          wordStats.set(word, {
            count: stats.count + 1,
            example: stats.example // keep the first encounter as example
          });
        }
      });
    });

    // Sort by frequency and return VocabItem[]
    return Array.from(wordStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([word, stats]) => ({
        word,
        count: stats.count,
        example: stats.example
      }));
  }

  private isValidWord(word: string): boolean {
    if (!word || word.length < 3) return false;
    if (STOP_WORDS_DE.has(word)) return false;
    // Basic check for only letters (German letters included)
    return /^[a-zäöüß]+$/i.test(word);
  }
}

