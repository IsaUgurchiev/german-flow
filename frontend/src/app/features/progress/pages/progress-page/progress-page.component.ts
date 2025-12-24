import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { ProgressSummaryService } from '../../../../core/services/progress-summary.service';
import { MyWordsRepository } from '../../../../core/repositories/my-words.repository';
import { XpService } from '../../../../core/services/xp.service';
import { UserProgressService } from '../../../../core/services/user-progress.service';
import { ExerciseProgressService } from '../../../../core/services/exercise-progress';
import { LessonsService } from '../../../../core/services/lessons.service';
import { ExerciseDataService, ExerciseData } from '../../../../core/services/exercise-data';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { LessonMeta } from '../../../../core/models/lesson.model';

interface LessonProgress {
  lessonId: string;
  title: string;
  totalExercises: number;
  completedExercises: number;
  percent: number;
  byType: {
    type: string;
    label: string;
    total: number;
    completed: number;
    percent: number;
  }[];
}

const EXERCISE_LABELS: Record<string, string> = {
  'word_translation_mcq': 'Word',
  'sentence_translation_mcq': 'Sentence',
  'comprehension_mcq': 'Context',
  'fill_blank': 'Fill-in'
};

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
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
          <div class="lg:col-span-1 space-y-8">
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
                      title="Copy all words"
                      class="p-2 rounded-xl text-text-primary bg-white dark:bg-[#2a2a1a] border border-[#e6e6e0] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[18px]">content_copy</span>
                    </button>
                    <button 
                      (click)="confirmClear()"
                      title="Clear all"
                      class="p-2 rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[18px]">delete</span>
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

            <!-- XP Log moved here as a smaller block -->
            <section class="bg-white dark:bg-[#1e1e12] rounded-3xl border border-[#f0f0eb] dark:border-[#33332a] shadow-sm overflow-hidden flex flex-col">
              <div class="px-6 py-5 border-b border-[#f0f0eb] dark:border-[#33332a] bg-gray-50/50 dark:bg-white/5">
                <h2 class="text-lg font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">history</span>
                  Recent Activity
                </h2>
              </div>
              
              <div class="p-4 space-y-3">
                @for (entry of xpLog(); track entry.ts) {
                  <div class="flex items-center justify-between gap-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-[#f0f0eb]/50 dark:border-[#33332a]/50">
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-text-primary dark:text-white truncate">{{ entry.reason }}</p>
                      <p class="text-[9px] text-text-secondary dark:text-gray-500 uppercase font-medium">{{ entry.ts | date:'MMM d, HH:mm' }}</p>
                    </div>
                    <div class="flex items-center gap-0.5 text-green-600 dark:text-green-400 font-black text-xs shrink-0">
                      +{{ entry.amount }}
                    </div>
                  </div>
                } @empty {
                  <div class="py-8 flex flex-col items-center justify-center text-center">
                    <p class="text-text-secondary dark:text-gray-500 text-xs font-medium">No activity yet</p>
                  </div>
                }
              </div>
            </section>
          </div>

          <!-- Activity / Progress by Lessons -->
          <div class="lg:col-span-2">
            <section class="bg-white dark:bg-[#1e1e12] rounded-3xl border border-[#f0f0eb] dark:border-[#33332a] shadow-sm overflow-hidden h-full flex flex-col">
              <div class="px-6 py-5 border-b border-[#f0f0eb] dark:border-[#33332a] bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                <h2 class="text-xl font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">analytics</span>
                  Lesson Progress
                </h2>
              </div>
              
              <div class="flex-1 p-6 space-y-6">
                @if (isLoadingTotals()) {
                  <div class="flex flex-col items-center justify-center py-20 gap-4 text-text-secondary">
                    <div class="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p class="text-sm font-medium">Loading progress data...</p>
                  </div>
                } @else {
                  @for (lesson of lessonProgress(); track lesson.lessonId) {
                    <div class="p-5 rounded-[24px] bg-gray-50/50 dark:bg-white/5 border border-[#f0f0eb] dark:border-[#33332a] hover:border-primary/30 transition-all group">
                      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                        <div class="min-w-0">
                          <a 
                            [routerLink]="['/video', lesson.lessonId]"
                            class="text-lg font-black text-text-primary dark:text-white hover:text-primary transition-colors flex items-center gap-2"
                          >
                            {{ lesson.title }}
                            <span class="material-symbols-outlined !text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                          </a>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                          <div class="text-right">
                            <span class="text-sm font-black text-text-primary dark:text-white">
                              {{ lesson.completedExercises }}/{{ lesson.totalExercises }}
                            </span>
                            <span class="text-xs font-medium text-text-secondary dark:text-gray-500 ml-1">
                              ({{ lesson.percent | number:'1.0-0' }}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Overall Progress Bar -->
                      <div class="h-2 w-full bg-gray-200/50 dark:bg-white/10 rounded-full overflow-hidden mb-5">
                        <div 
                          class="h-full rounded-full transition-all duration-1000 ease-out" 
                          [class.bg-green-500]="lesson.percent > 0"
                          [class.shadow-[0_0_12px_rgba(34,197,94,0.4)]]="lesson.percent === 100"
                          [style.width.%]="lesson.percent"
                        ></div>
                      </div>

                      <!-- Breakdown -->
                      <div class="flex flex-wrap gap-2">
                        @for (type of lesson.byType; track type.type) {
                          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1e1e12] border border-[#f0f0eb] dark:border-[#33332a] text-[11px]">
                            <span class="font-bold text-text-secondary dark:text-gray-400 uppercase tracking-tight">{{ type.label }}</span>
                            <span class="w-[1px] h-3 bg-gray-200 dark:bg-gray-700"></span>
                            <span class="font-black text-text-primary dark:text-white">{{ type.completed }}/{{ type.total }}</span>
                            @if (type.percent === 100) {
                              <span class="material-symbols-outlined !text-[14px] text-green-500 font-bold">check_circle</span>
                            } @else {
                              <span class="text-text-secondary dark:text-gray-500 font-medium">{{ type.percent | number:'1.0-0' }}%</span>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  } @empty {
                    <div class="py-12 flex flex-col items-center justify-center text-center">
                      <span class="material-symbols-outlined text-gray-200 dark:text-gray-700 !text-[64px] mb-4">history_edu</span>
                      <p class="text-text-primary dark:text-white font-bold mb-1">No lessons available</p>
                      <p class="text-text-secondary dark:text-gray-500 text-sm max-w-xs">Complete lessons in the catalog to see your progress here.</p>
                    </div>
                  }
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
export class ProgressPageComponent implements OnInit {
  private summaryService = inject(ProgressSummaryService);
  private myWordsRepository = inject(MyWordsRepository);
  private xpService = inject(XpService);
  private userProgressService = inject(UserProgressService);
  private exerciseProgressService = inject(ExerciseProgressService);
  private lessonsService = inject(LessonsService);
  private exerciseDataService = inject(ExerciseDataService);
  private router = inject(Router);
  
  private refreshTrigger = signal(0);
  private allLessons = signal<LessonMeta[]>([]);
  private lessonTotals = signal<Record<string, ExerciseData | null>>({});
  isLoadingTotals = signal(true);
  
  showClearModal = signal(false);
  showCopyToast = signal(false);

  ngOnInit() {
    this.loadLessonData();
  }

  private loadLessonData() {
    this.lessonsService.getAllLessons().pipe(
      switchMap(lessons => {
        this.allLessons.set(lessons);
        if (lessons.length === 0) return of([]);
        
        const obs = lessons.map(lesson => 
          this.exerciseDataService.getExercisesForLesson(lesson.id).pipe(
            map(data => ({ id: lesson.id, data }))
          )
        );
        return forkJoin(obs);
      })
    ).subscribe(results => {
      const totalsMap: Record<string, ExerciseData | null> = {};
      results.forEach(res => {
        totalsMap[res.id] = res.data;
      });
      this.lessonTotals.set(totalsMap);
      this.isLoadingTotals.set(false);
    });
  }

  lessonProgress = computed(() => {
    const lessons = this.allLessons();
    const totals = this.lessonTotals();
    const attempts = this.exerciseProgressService.getAttempts();

    return lessons.map(lesson => {
      const data = totals[lesson.id];
      if (!data) return null;

      const byType = data.exerciseSets.map(set => {
        const total = set.items.length;
        const completed = set.items.filter(item => 
          attempts.some(a => a.exerciseId === item.id && a.isCorrect)
        ).length;
        
        return {
          type: set.type,
          label: EXERCISE_LABELS[set.type] || set.type,
          total,
          completed,
          percent: total > 0 ? (completed / total) * 100 : 0
        };
      }).filter(t => t.total > 0);

      const totalAll = byType.reduce((acc, curr) => acc + curr.total, 0);
      const completedAll = byType.reduce((acc, curr) => acc + curr.completed, 0);

      return {
        lessonId: lesson.id,
        title: lesson.title,
        totalExercises: totalAll,
        completedExercises: completedAll,
        percent: totalAll > 0 ? (completedAll / totalAll) * 100 : 0,
        byType
      };
    }).filter(p => p !== null) as LessonProgress[];
  });
  
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
    const lastId = this.userProgressService.lastLessonId();
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

