import { Component, input, signal, inject, output, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { XpService } from '../../../../core/services/xp.service';
import { FillBlankExerciseItem } from '../../models/exercise.model';
import { ExerciseShellComponent } from '../exercise-shell/exercise-shell.component';
import { ExerciseProgressService } from '../../../../core/services/exercise-progress';

@Component({
  selector: 'app-fill-blank-card',
  standalone: true,
  imports: [FormsModule, ExerciseShellComponent],
  template: `
    <app-exercise-shell
      [current]="current()"
      [total]="total()"
      [history]="history()"
      [checked]="checked()"
      [isCorrect]="isCorrect()"
      [canCheck]="canCheck()"
      [correctLabel]="exercise().answer"
      (check)="onCheck()"
      (next)="onNext()"
    >
      <div class="flex flex-col gap-8">
        <div>
          <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest mb-3 block">
            Fill in the blank:
          </span>
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-[#25251a] border-2 border-[#f0f0eb] dark:border-[#33332a]">
            <h3 class="text-xl font-bold text-text-primary dark:text-white leading-relaxed italic">
              "{{ exercise().maskedText }}"
            </h3>
          </div>
        </div>

        <div class="flex flex-col gap-3 w-full">
          @if (!exercise().answer) {
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-[#25251a] text-text-secondary dark:text-gray-500 text-xs font-medium border border-dashed border-gray-200 dark:border-gray-800">
              Нет подходящих слов для упражнения в этой строке.
            </div>
          } @else {
            <input 
              type="text" 
              [(ngModel)]="userAnswer"
              (keyup.enter)="onCheck()"
              [disabled]="checked()"
              placeholder="Type the missing word..."
              class="w-full h-14 px-6 rounded-xl border-2 bg-transparent text-lg font-medium outline-none transition-all"
              [class.border-[#e6e6e0]]="!checked()"
              [class.dark:border-[#444]]="!checked()"
              [class.focus:border-primary]="!checked()"
              
              [class.border-green-500]="checked() && isCorrect()"
              [class.bg-green-500/5]="checked() && isCorrect()"
              
              [class.border-red-500]="checked() && !isCorrect()"
              [class.bg-red-500/5]="checked() && !isCorrect()"
            />
          }
        </div>
      </div>
    </app-exercise-shell>
  `,
  styles: [`:host { display: block; }`]
})
export class FillBlankCardComponent {
  private progressService = inject(ExerciseProgressService);

  exercise = input.required<FillBlankExerciseItem>();
  current = input.required<number>();
  total = input.required<number>();
  history = input<(boolean | null)[]>([]);

  check = output<{ isCorrect: boolean; selectedIndex: number; userAnswer?: string }>();
  next = output<void>();
  
  userAnswer = signal('');
  checked = signal(false);
  
  isCorrect = signal(false);

  constructor() {
    effect(() => {
      const ex = this.exercise();
      if (ex) {
        const attempt = this.progressService.getAttempt((ex as any).id);
        if (attempt) {
          this.userAnswer.set(attempt.userAnswer ?? '');
          this.isCorrect.set(attempt.isCorrect);
          this.checked.set(true);
        } else {
          this.userAnswer.set('');
          this.isCorrect.set(false);
          this.checked.set(false);
        }
      }
    });
  }

  canCheck = computed(() => {
    return this.userAnswer().trim().length > 0;
  });

  onCheck() {
    if (!this.canCheck() || this.checked()) return;

    const answer = this.exercise().answer;
    if (!answer) return;

    const normalizedUser = this.userAnswer().toLowerCase().trim().replace(/[.,!?;:()"]/g, '');
    const normalizedCorrect = answer.toLowerCase().trim().replace(/[.,!?;:()"]/g, '');
    
    const correct = normalizedUser === normalizedCorrect;
    this.isCorrect.set(correct);
    this.checked.set(true);

    this.check.emit({
      isCorrect: correct,
      selectedIndex: 0,
      userAnswer: normalizedUser
    });
  }

  onNext() {
    this.next.emit();
    this.reset();
  }

  private reset() {
    this.userAnswer.set('');
    this.checked.set(false);
    this.isCorrect.set(false);
  }
}
