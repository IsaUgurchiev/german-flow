import { Injectable } from '@angular/core';
import { SubtitleLine } from './subtitle.service';
import { STOP_WORDS_DE } from '../../shared/utils/stop-words.de';

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  /**
   * Extracts potential vocabulary words from subtitle lines.
   * Filters out stop words, punctuation, and short words.
   */
  extractPotentialWords(lines: SubtitleLine[]): string[] {
    const wordCounts = new Map<string, number>();
    
    lines.forEach(line => {
      // Remove punctuation and split by whitespace
      const words = line.text
        .toLowerCase()
        .replace(/[.,!?;:()"]/g, '')
        .split(/\s+/);
        
      words.forEach(word => {
        if (this.isValidWord(word)) {
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
      });
    });

    // Sort by frequency and return top words
    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }

  private isValidWord(word: string): boolean {
    if (!word || word.length < 3) return false;
    if (STOP_WORDS_DE.has(word)) return false;
    // Basic check for only letters (German letters included)
    return /^[a-zäöüß]+$/i.test(word);
  }
}

