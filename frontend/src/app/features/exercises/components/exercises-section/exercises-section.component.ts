import { Component, input, signal, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FillBlankCardComponent } from '../fill-blank-card/fill-blank-card.component';
import { WordTranslationMcqComponent } from '../word-translation-mcq/word-translation-mcq.component';
import { SentenceTranslationMcqComponent } from '../sentence-translation-mcq/sentence-translation-mcq.component';
import { ComprehensionMcqComponent } from '../comprehension-mcq/comprehension-mcq.component';
import { ExerciseDataService, ExerciseSet, ExerciseType } from '../../../../core/services/exercise-data';
import { ExerciseProgressService } from '../../../../core/services/exercise-progress';
import { XpService } from '../../../../core/services/xp.service';

type ExerciseTabId = ExerciseType;

const EXERCISE_CONFIG: Record<ExerciseType, { label: string; xp: number }> = {
  'word_translation_mcq': { label: 'Word Translation', xp: 10 },
  'sentence_translation_mcq': { label: 'Sentence Translation', xp: 10 },
  'comprehension_mcq': { label: 'Comprehension', xp: 10 },
  'fill_blank': { label: 'Fill in the Blank', xp: 15 },
};

@Component({
  selector: 'app-exercises-section',
  standalone: true,
  imports: [
    CommonModule,
    FillBlankCardComponent,
    WordTranslationMcqComponent,
    SentenceTranslationMcqComponent,
    ComprehensionMcqComponent
  ],
  template: `
    <div class="flex flex-col gap-6 pb-12">
      <div class="flex items-center justify-between">
        <h3 class="text-text-primary dark:text-white text-2xl font-bold">Interactive Exercises</h3>
      </div>

      <div class="bg-white dark:bg-[#1e1e12] rounded-2xl border border-[#e6e6e0] dark:border-[#33332a] shadow-sm flex flex-col w-full overflow-hidden relative">
        <!-- XP Burst Animation -->
        @if (showXpBurst()) {
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
            <div class="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full text-lg font-black shadow-2xl animate-in fade-out zoom-out slide-out-to-top-24 duration-1000 fill-mode-forwards">
              <span class="material-symbols-outlined !text-[24px]">bolt</span>
              +{{ lastXpAmount() }} XP
            </div>
          </div>
        }

        <!-- Tabs Header -->
        <div class="flex flex-row overflow-x-auto border-b border-[#e6e6e0] dark:border-[#33332a] hide-scrollbar" style="scrollbar-width: none;">
          @for (tab of exerciseTabs; track tab.id) {
            <button
              (click)="activeTabId.set(tab.id)"
              [disabled]="tab.disabled"
              class="relative px-6 py-4 text-sm whitespace-nowrap transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              [class.font-bold]="activeTabId() === tab.id"
              [class.text-text-primary]="activeTabId() === tab.id"
              [class.dark:text-white]="activeTabId() === tab.id"
              [class.bg-primary/10]="activeTabId() === tab.id"
              [class.font-medium]="activeTabId() !== tab.id"
              [class.text-text-secondary]="activeTabId() !== tab.id"
              [class.dark:text-gray-400]="activeTabId() !== tab.id"
              [class.hover:text-text-primary]="activeTabId() !== tab.id"
              [class.dark:hover:text-white]="activeTabId() !== tab.id"
              [class.hover:bg-gray-50]="activeTabId() !== tab.id"
              [class.dark:hover:bg-[#25251a]]="activeTabId() !== tab.id"
            >
              {{ tab.label }}
              @if (activeTabId() === tab.id) {
                <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"></div>
              }
            </button>
          }
        </div>

        <!-- Tab Content -->
        <div class="p-6 md:p-8 min-h-[400px]">
          @if (activeSet(); as set) {
            <div class="max-w-3xl mx-auto w-full">
              <!-- Current Exercise Renderer -->
              @if (set.items[currentIndices()[set.type]]; as exercise) {
                @switch (set.type) {
                  @case ('word_translation_mcq') {
                    <app-word-translation-mcq
                      [exercise]="exercise"
                      [current]="currentIndices()[set.type] + 1"
                      [total]="set.items.length"
                      [history]="exerciseResults()[set.type]"
                      (check)="onCheck(exercise, set.type, $event)"
                      (next)="onNext(set.type)"
                      (goTo)="onGoTo(set.type, $event)"
                    />
                  }
                  @case ('sentence_translation_mcq') {
                    <app-sentence-translation-mcq
                      [exercise]="exercise"
                      [current]="currentIndices()[set.type] + 1"
                      [total]="set.items.length"
                      [history]="exerciseResults()[set.type]"
                      (check)="onCheck(exercise, set.type, $event)"
                      (next)="onNext(set.type)"
                      (goTo)="onGoTo(set.type, $event)"
                    />
                  }
                  @case ('comprehension_mcq') {
                    <app-comprehension-mcq
                      [exercise]="exercise"
                      [current]="currentIndices()[set.type] + 1"
                      [total]="set.items.length"
                      [history]="exerciseResults()[set.type]"
                      (check)="onCheck(exercise, set.type, $event)"
                      (next)="onNext(set.type)"
                      (goTo)="onGoTo(set.type, $event)"
                    />
                  }
                  @case ('fill_blank') {
                    <app-fill-blank-card
                      [exercise]="exercise"
                      [current]="currentIndices()[set.type] + 1"
                      [total]="set.items.length"
                      [history]="exerciseResults()[set.type]"
                      (check)="onCheck(exercise, set.type, $event)"
                      (next)="onNext(set.type)"
                      (goTo)="onGoTo(set.type, $event)"
                    />
                  }
                }
              } @else {
                <div class="py-12 flex flex-col items-center justify-center text-center">
                  <span class="material-symbols-outlined text-green-500 !text-[64px] mb-4">task_alt</span>
                  <p class="text-text-primary dark:text-white font-bold mb-1">Type Completed!</p>
                  <p class="text-text-secondary dark:text-gray-500 text-sm">You've finished all exercises in this category.</p>
                  <button (click)="resetIndices(set.type)" class="mt-4 text-primary font-bold hover:underline cursor-pointer">Restart</button>
                </div>
              }
            </div>
          } @else {
            <div class="py-12 px-6 rounded-3xl border-2 border-dashed border-[#f0f0eb] dark:border-[#33332a] flex flex-col items-center justify-center text-center">
              <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 !text-[64px] mb-4">pending_actions</span>
              <p class="text-text-primary dark:text-white font-bold mb-1">
                No exercises available
              </p>
              <p class="text-text-secondary dark:text-gray-500 text-sm max-w-xs">
                Select another tab or wait for data to load.
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `],
})
export class ExercisesSectionComponent {
  private dataService = inject(ExerciseDataService);
  private progressService = inject(ExerciseProgressService);
  private xpService = inject(XpService);

  lessonId = input.required<string>();
  exerciseSet = input<any[]>([]);

  exerciseData = signal<ExerciseSet[]>([]);
  activeTabId = signal<ExerciseTabId>('word_translation_mcq');
  showXpBurst = signal(false);
  lastXpAmount = signal(10);
  exerciseResults = signal<Record<ExerciseType, (boolean | null)[]>>({
    'word_translation_mcq': [],
    'sentence_translation_mcq': [],
    'comprehension_mcq': [],
    'fill_blank': []
  });

  currentIndices = signal<Record<ExerciseType, number>>({
    'word_translation_mcq': 0,
    'sentence_translation_mcq': 0,
    'comprehension_mcq': 0,
    'fill_blank': 0
  });

  constructor() {
    // 1. Load exercises for the lesson
    effect(() => {
      const id = this.lessonId();
      if (id) {
        this.dataService.getExercisesForLesson(id).subscribe(data => {
          if (data) {
            this.exerciseData.set(data.exerciseSets);

            // Set first available tab as active
            const firstAvailable = data.exerciseSets.find(s => s.items.length > 0);
            if (firstAvailable) {
              this.activeTabId.set(firstAvailable.type);
            }
          }
        });
      }
    });

    // 2. Sync exerciseResults and currentIndices with progressService
    effect(() => {
      const attempts = this.progressService.getAttempts();
      const data = this.exerciseData();
      const fillBlankSet = this.exerciseSet();
      
      if (data.length > 0 || fillBlankSet.length > 0) {
        this.exerciseResults.update(current => {
          const newResults = { ...current };
          
          // Sync all types
          const types: ExerciseType[] = ['word_translation_mcq', 'sentence_translation_mcq', 'comprehension_mcq', 'fill_blank'];
          
          types.forEach(type => {
            const items = type === 'fill_blank' ? fillBlankSet : data.find(s => s.type === type)?.items || [];
            if (items.length > 0) {
              newResults[type] = items.map((ex: any, idx) => {
                const attempt = attempts.find(a => a.exerciseId === ex.id);
                // Priority: 1. Server/Saved attempt, 2. Current session result (if any), 3. null
                if (attempt) return attempt.isCorrect;
                return newResults[type]?.[idx] ?? null;
              });
            }
          });
          
          return newResults;
        });

        // Auto-advance currentIndices to first unsolved exercise for each type (only if not already advanced)
        this.currentIndices.update(prev => {
          const nextIndices = { ...prev };
          const types: ExerciseType[] = ['word_translation_mcq', 'sentence_translation_mcq', 'comprehension_mcq', 'fill_blank'];
          
          types.forEach(type => {
            // Only auto-advance if we are at the start (to avoid jumping while user is playing)
            if (nextIndices[type] === 0) {
              const items = type === 'fill_blank' ? fillBlankSet : data.find(s => s.type === type)?.items || [];
              const firstUnsolvedIdx = items.findIndex((ex: any) => !this.progressService.isCompleted(ex.id));
              if (firstUnsolvedIdx !== -1) {
                nextIndices[type] = firstUnsolvedIdx;
              } else if (items.length > 0) {
                // All solved, stay at the end or at 0? 
                // We'll go to items.length to show "Completed" state
                nextIndices[type] = items.length;
              }
            }
          });
          return nextIndices;
        });
      }
    });
  }

  get exerciseTabs() {
    return (Object.keys(EXERCISE_CONFIG) as ExerciseType[]).map(type => ({
      id: type as ExerciseTabId,
      label: EXERCISE_CONFIG[type].label,
      disabled: !this.hasData(type)
    }));
  }

  activeSet = computed(() => {
    if (this.activeTabId() === 'fill_blank' && this.exerciseSet().length > 0) {
      return {
        type: 'fill_blank' as ExerciseType,
        items: this.exerciseSet() as any[]
      };
    }
    return this.exerciseData().find(s => s.type === this.activeTabId()) || null;
  });

  private hasData(type: ExerciseType): boolean {
    if (type === 'fill_blank') return this.exerciseSet().length > 0;
    const data = this.exerciseData();
    return Array.isArray(data) && data.some(s => s.type === type && s.items && s.items.length > 0);
  }

  onCheck(exercise: any, type: ExerciseType, result: { isCorrect: boolean; selectedIndex: number; userAnswer?: string }) {
    // Check if already correctly answered to prevent double XP
    const wasAlreadyCorrect = this.progressService.isCompleted(exercise.id);

    if (result.isCorrect && !wasAlreadyCorrect) {
      const amount = EXERCISE_CONFIG[type].xp;
      this.lastXpAmount.set(amount);
      this.showXpBurst.set(true);
      this.xpService.addXp(amount, `Completed ${EXERCISE_CONFIG[type].label}`);
      setTimeout(() => this.showXpBurst.set(false), 1000);
    }

    this.exerciseResults.update(prev => {
      const newResults = { ...prev };
      newResults[type] = [...newResults[type]];
      newResults[type][this.currentIndices()[type]] = result.isCorrect;
      return newResults;
    });

    this.progressService.saveAttempt({
      exerciseId: exercise.id,
      exerciseType: type,
      lessonId: this.lessonId(),
      isCorrect: result.isCorrect,
      selectedIndex: result.selectedIndex,
      userAnswer: result.userAnswer,
      ts: Date.now()
    });
  }

  onNext(type: ExerciseType) {
    this.currentIndices.update(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  }

  onGoTo(type: ExerciseType, index: number) {
    this.currentIndices.update(prev => ({
      ...prev,
      [type]: index
    }));
  }

  resetIndices(type: ExerciseType) {
    this.currentIndices.update(prev => ({
      ...prev,
      [type]: 0
    }));
    this.exerciseResults.update(prev => {
      const newResults = { ...prev };
      newResults[type] = new Array(newResults[type].length).fill(null);
      return newResults;
    });
  }
}

