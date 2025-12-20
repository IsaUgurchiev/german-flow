import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyWordsRepository {
  private readonly STORAGE_KEY = 'gf.words.saved';

  /**
   * Returns all saved words from localStorage.
   */
  getAll(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Adds a word to the saved list, preventing duplicates and normalizing to lowercase.
   */
  add(word: string): void {
    const words = this.getAll();
    const normalized = word.toLowerCase().trim();
    if (!words.includes(normalized)) {
      words.push(normalized);
      this.save(words);
    }
  }

  /**
   * Removes a word from the saved list.
   */
  remove(word: string): void {
    const words = this.getAll();
    const normalized = word.toLowerCase().trim();
    const filtered = words.filter(w => w !== normalized);
    if (filtered.length !== words.length) {
      this.save(filtered);
    }
  }

  /**
   * Checks if a word is already saved.
   */
  isSaved(word: string): boolean {
    return this.getAll().includes(word.toLowerCase().trim());
  }

  private save(words: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(words));
  }
}

