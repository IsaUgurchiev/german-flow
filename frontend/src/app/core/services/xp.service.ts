import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class XpService {
  private readonly STORAGE_KEY = 'gf.xp.total';
  private readonly LOG_KEY = 'gf.xp.log';
  
  // Internal signals to track XP for reactive UI updates within the app
  totalXp = signal<number>(this.loadXp());
  xpLog = signal<XpLogEntry[]>(this.loadLog());

  /**
   * Returns current total XP.
   */
  getXp(): number {
    return this.totalXp();
  }

  /**
   * Returns the XP activity log.
   */
  getLog(): XpLogEntry[] {
    return this.xpLog();
  }

  /**
   * Adds XP amount if positive and persists to localStorage.
   */
  addXp(amount: number, reason: string = 'Exercise completed'): void {
    if (amount <= 0) return;
    
    const timestamp = Date.now();
    
    // Update total XP
    this.totalXp.update(current => {
      const newVal = current + amount;
      this.saveXp(newVal);
      return newVal;
    });

    // Update log
    this.xpLog.update(current => {
      const newEntry: XpLogEntry = { ts: timestamp, amount, reason };
      const newLog = [newEntry, ...current].slice(0, 50); // Keep last 50 entries
      this.saveLog(newLog);
      return newLog;
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

  private loadLog(): XpLogEntry[] {
    const stored = localStorage.getItem(this.LOG_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveLog(log: XpLogEntry[]): void {
    localStorage.setItem(this.LOG_KEY, JSON.stringify(log));
  }

  /**
   * Hydrates the service state from an external source (e.g., backend sync).
   */
  hydrate(totalXp: number, log: XpLogEntry[]): void {
    this.totalXp.set(totalXp);
    this.xpLog.set(log);
    this.saveXp(totalXp);
    this.saveLog(log);
  }
}

export interface XpLogEntry {
  ts: number;
  amount: number;
  reason: string;
}

