import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyWordsRepository {
  private readonly STORAGE_KEY = 'gf.words.saved';
  
  // Internal signal for reactivity
  private words = signal<string[]>(this.loadWords());

  /**
   * Returns all saved words.
   */
  getAll(): string[] {
    return this.words();
  }

  private loadWords(): string[] {
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
    const currentWords = this.words();
    const normalized = word.toLowerCase().trim();
    if (!currentWords.includes(normalized)) {
      const newWords = [...currentWords, normalized];
      this.words.set(newWords);
      this.save(newWords);
    }
  }

  /**
   * Removes a word from the saved list.
   */
  remove(word: string): void {
    const currentWords = this.words();
    const normalized = word.toLowerCase().trim();
    const filtered = currentWords.filter(w => w !== normalized);
    if (filtered.length !== currentWords.length) {
      this.words.set(filtered);
      this.save(filtered);
    }
  }

  /**
   * Checks if a word is already saved.
   */
  isSaved(word: string): boolean {
    return this.words().includes(word.toLowerCase().trim());
  }

  /**
   * Clears all saved words.
   */
  clearAll(): void {
    this.words.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private save(words: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(words));
  }

  /**
   * Hydrates the repository from an external source (e.g., backend sync).
   */
  hydrate(words: string[]): void {
    this.words.set(words);
    this.save(words);
  }
}

