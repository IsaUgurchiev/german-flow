import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class XpService {
  private readonly STORAGE_KEY = 'gf.xp.total';
  
  // Internal signal to track XP for reactive UI updates within the app
  private totalXp = signal<number>(this.loadXp());

  /**
   * Returns current total XP.
   */
  getXp(): number {
    return this.totalXp();
  }

  /**
   * Adds XP amount if positive and persists to localStorage.
   */
  addXp(amount: number): void {
    if (amount <= 0) return;
    
    this.totalXp.update(current => {
      const newVal = current + amount;
      this.saveXp(newVal);
      return newVal;
    });
  }

  private loadXp(): number {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return 0;
    
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private saveXp(amount: number): void {
    localStorage.setItem(this.STORAGE_KEY, amount.toString());
  }
}

