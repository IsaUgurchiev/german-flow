import { Injectable } from '@angular/core';
import { STOP_WORDS_DE } from '../../shared/utils/stop-words.de';

export interface FillBlankExercise {
  maskedText: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class FillBlankService {
  /**
   * Generates a fill-in-the-blank exercise from a given text.
   * Choose 1 target token (not a German stop-word, length >= 3).
   * maskedText should preserve punctuation and spacing as much as possible.
   */
  generateExercise(text: string): FillBlankExercise | null {
    if (!text || text.trim().length === 0) {
      return null;
    }

    // Split text into tokens, keeping track of their positions to preserve punctuation
    // We want to find words, not just segments separated by spaces.
    // A regex that matches words (including German characters)
    const wordRegex = /[a-zäöüß]+/gi;
    const tokens: RegExpExecArray[] = [];
    let match;
    
    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[0];
      const cleanWord = word.toLowerCase();
      
      if (cleanWord.length >= 3 && !STOP_WORDS_DE.has(cleanWord)) {
        tokens.push(match);
      }
    }

    if (tokens.length === 0) {
      // Safe fallback if no suitable token exists
      return {
        maskedText: text,
        answer: '',
      };
    }

    // Choose 1 target token (randomly from valid ones)
    const targetTokenMatch = tokens[Math.floor(Math.random() * tokens.length)];
    const targetWord = targetTokenMatch[0];
    const startIndex = targetTokenMatch.index;
    const endIndex = startIndex + targetWord.length;

    // Mask the token in the original text to preserve surrounding characters
    const maskedText = 
      text.substring(0, startIndex) + 
      '______' + 
      text.substring(endIndex);

    return {
      maskedText,
      answer: targetWord,
    };
  }
}

