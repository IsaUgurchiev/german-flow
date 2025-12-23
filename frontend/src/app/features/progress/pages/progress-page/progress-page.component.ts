import { Component, inject, computed, signal } from '@angular/core';
import { ProgressSummaryService } from '../../../../core/services/progress-summary.service';
import { MyWordsRepository } from '../../../../core/repositories/my-words.repository';
import { XpService } from '../../../../core/services/xp.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="flex-1 overflow-y-auto bg-[#fcfcf9] dark:bg-[#0f0f05] p-6 md:p-10">
      <div class="max-w-6xl mx-auto">
        <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-text-primary dark:text-white">My Progress</h1>
            <p class="text-text-secondary dark:text-gray-400 mt-2">Track your learning journey and saved words.</p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              (click)="continueLearning()"
              class="px-6 py-3 rounded-2xl bg-primary text-text-primary font-bold shadow-lg shadow-primary/20 hover:bg-[#e6e205] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined font-bold">play_circle</span>
              Continue Learning
            </button>
            <a 
              routerLink="/catalog"
              class="px-6 py-3 rounded-2xl bg-white dark:bg-[#1e1e12] border border-[#f0f0eb] dark:border-[#33332a] text-text-primary dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined font-bold">grid_view</span>
              Catalog
            </a>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <!-- Stats cards -->
          <div class="bg-white dark:bg-[#1e1e12] rounded-3xl p-6 border border-[#f0f0eb] dark:border-[#33332a] shadow-sm flex items-center gap-5">
            <div class="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined !text-[32px]">bolt</span>
            </div>
            <div>
              <p class="text-sm font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Total XP</p>
              <p class="text-2xl font-black text-text-primary dark:text-white">{{ summary().totalXp.toLocaleString() }}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1e1e12] rounded-3xl p-6 border border-[#f0f0eb] dark:border-[#33332a] shadow-sm flex items-center gap-5">
            <div class="size-14 rounded-2xl bg-[#00a3ff]/10 flex items-center justify-center text-[#00a3ff]">
              <span class="material-symbols-outlined !text-[32px]">menu_book</span>
            </div>
            <div>
              <p class="text-sm font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Saved Words</p>
              <p class="text-2xl font-black text-text-primary dark:text-white">{{ summary().savedWordsCount }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- My Words Preview -->
          <div class="lg:col-span-2 space-y-8">
            <section class="bg-white dark:bg-[#1e1e12] rounded-3xl border border-[#f0f0eb] dark:border-[#33332a] shadow-sm overflow-hidden">
              <div class="px-6 py-5 border-b border-[#f0f0eb] dark:border-[#33332a] flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                <h2 class="text-xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">bookmark</span>
                  My Words
                </h2>
                
                @if (savedWords().length > 0) {
                  <div class="flex items-center gap-2">
                    <button 
                      (click)="copyAll()"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-text-primary bg-white dark:bg-[#2a2a1a] border border-[#e6e6e0] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[16px]">content_copy</span>
                      Copy all
                    </button>
                    <button 
                      (click)="confirmClear()"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[16px]">delete</span>
                      Clear all
                    </button>
                  </div>
                }
              </div>

              <div class="p-6">
                @if (savedWords().length === 0) {
                  <div class="py-12 flex flex-col items-center justify-center text-center">
                    <span class="material-symbols-outlined text-gray-200 dark:text-gray-700 !text-[64px] mb-4">book</span>
                    <p class="text-text-primary dark:text-white font-bold mb-1">No words saved yet</p>
                    <p class="text-text-secondary dark:text-gray-500 text-sm max-w-xs">Words you add during lessons will appear here.</p>
                  </div>
                } @else {
                  <div class="flex flex-wrap gap-2">
                    @for (word of previewWords(); track word) {
                      <span class="px-3 py-1.5 rounded-xl bg-[#f9f506]/10 text-text-primary dark:text-white text-sm font-medium border border-[#f9f506]/20">
                        {{ word }}
                      </span>
                    }
                    @if (savedWords().length > 10) {
                      <span class="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#25251a] text-text-secondary dark:text-gray-400 text-sm font-medium border border-[#e6e6e0] dark:border-[#33332a]">
                        +{{ savedWords().length - 10 }} more
                      </span>
                    }
                  </div>
                }
              </div>
            </section>
          </div>

          <!-- XP Log -->
          <div class="lg:col-span-1">
            <section class="bg-white dark:bg-[#1e1e12] rounded-3xl border border-[#f0f0eb] dark:border-[#33332a] shadow-sm overflow-hidden h-full flex flex-col">
              <div class="px-6 py-5 border-b border-[#f0f0eb] dark:border-[#33332a] bg-gray-50/50 dark:bg-white/5">
                <h2 class="text-xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">history</span>
                  Activity
                </h2>
              </div>
              
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                @for (entry of xpLog(); track entry.ts) {
                  <div class="flex items-center justify-between gap-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-[#f0f0eb]/50 dark:border-[#33332a]/50">
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-text-primary dark:text-white truncate">{{ entry.reason }}</p>
                      <p class="text-[10px] text-text-secondary dark:text-gray-500 uppercase font-medium">{{ entry.ts | date:'MMM d, HH:mm' }}</p>
                    </div>
                    <div class="flex items-center gap-1 text-green-600 dark:text-green-400 font-black text-sm shrink-0">
                      +{{ entry.amount }}
                    </div>
                  </div>
                } @empty {
                  <div class="py-12 flex flex-col items-center justify-center text-center">
                    <span class="material-symbols-outlined text-gray-200 dark:text-gray-700 !text-[48px] mb-2">pending_actions</span>
                    <p class="text-text-secondary dark:text-gray-500 text-xs font-medium">No activity yet</p>
                  </div>
                }
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    @if (showClearModal()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" (click)="showClearModal.set(false)">
        <div 
          class="bg-white dark:bg-[#1e1e12] rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-[#f0f0eb] dark:border-[#33332a] animate-in zoom-in-95 duration-200"
          (click)="$event.stopPropagation()"
        >
          <div class="size-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto">
            <span class="material-symbols-outlined !text-[32px]">delete_forever</span>
          </div>
          
          <h3 class="text-xl font-bold text-text-primary dark:text-white text-center mb-2">Clear all words?</h3>
          <p class="text-text-secondary dark:text-gray-400 text-center mb-8 text-sm">This action cannot be undone. All your saved vocabulary will be removed.</p>
          
          <div class="flex flex-col gap-3">
            <button 
              (click)="clearAll()"
              class="w-full h-12 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 cursor-pointer"
            >
              Yes, clear all
            </button>
            <button 
              (click)="showClearModal.set(false)"
              class="w-full h-12 rounded-2xl bg-gray-50 dark:bg-[#2a2a1a] text-text-primary dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Copy Success Toast -->
    @if (showCopyToast()) {
      <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
        <div class="bg-text-primary dark:bg-white text-white dark:text-text-primary px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
          <span class="material-symbols-outlined text-primary !text-[20px]">check_circle</span>
          <span class="text-sm font-bold tracking-tight">Copied to clipboard!</span>
        </div>
      </div>
    }
  `,
  styles: [`:host { display: flex; flex: 1; min-height: 0; }`]
})
export class ProgressPageComponent {
  private summaryService = inject(ProgressSummaryService);
  private myWordsRepository = inject(MyWordsRepository);
  private xpService = inject(XpService);
  private progressService = inject(UserProgressService);
  private router = inject(Router);
  
  private refreshTrigger = signal(0);
  
  showClearModal = signal(false);
  showCopyToast = signal(false);
  
  savedWords = computed(() => {
    this.refreshTrigger();
    return this.myWordsRepository.getAll();
  });

  previewWords = computed(() => this.savedWords().slice(0, 10));
  
  summary = computed(() => {
    this.refreshTrigger();
    return this.summaryService.getSummary();
  });

  xpLog = computed(() => this.xpService.getLog().slice(0, 10));

  continueLearning() {
    const lastId = this.progressService.lastLessonId();
    if (lastId) {
      this.router.navigate(['/video', lastId]);
    } else {
      this.router.navigate(['/catalog']);
    }
  }

  copyAll() {
    const text = this.savedWords().join(', ');
    navigator.clipboard.writeText(text).then(() => {
      this.showCopyToast.set(true);
      setTimeout(() => this.showCopyToast.set(false), 2000);
    });
  }

  confirmClear() {
    this.showClearModal.set(true);
  }

  clearAll() {
    this.myWordsRepository.clearAll();
    this.refreshTrigger.update(n => n + 1);
    this.showClearModal.set(false);
  }
}

