import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full">
      <!-- Header with Progress -->
      <div class="flex items-center justify-between mb-8">
        <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest">
          Question {{ current() }} / {{ total() }}
        </span>
        <div class="flex gap-1.5">
          @for (step of stepsArray(); track $index) {
            <div 
              class="h-2 w-10 rounded-full transition-colors duration-500"
              [class.bg-green-500]="history()[$index] === true"
              [class.bg-red-500]="history()[$index] === false"
              [class.bg-primary]="$index === current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
              [class.bg-[#f0f0eb]]="$index !== current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
              [class.dark:bg-[#33332a]]="$index !== current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
            ></div>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <ng-content></ng-content>
      </div>

      <!-- Footer with Feedback & Action -->
      <div 
        class="mt-8 pt-6 border-t transition-colors duration-300"
        [class.border-transparent]="!checked()"
        [class.border-green-200]="checked() && isCorrect()"
        [class.border-red-200]="checked() && !isCorrect()"
      >
        @if (checked()) {
          <div class="mb-6 animate-in fade-in slide-in-from-bottom-2">
            @if (isCorrect()) {
              <div class="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                <span class="material-symbols-outlined">check_circle</span>
                <span>Correct! Well done.</span>
              </div>
            } @else {
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                  <span class="material-symbols-outlined">error</span>
                  <span>Incorrect. The correct answer was: {{ correctLabel() }}</span>
                </div>
                @if (rationale()) {
                  <p class="text-sm text-red-600/80 dark:text-red-300/80 ml-8">
                    {{ rationale() }}
                  </p>
                }
              </div>
            }
          </div>
        }

        <div class="flex justify-end">
          <button 
            (click)="onActionClick()"
            [disabled]="!canCheck() && !checked()"
            class="px-8 py-3.5 rounded-full font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
            [class.bg-primary]="!checked() || isCorrect()"
            [class.text-text-primary]="!checked() || isCorrect()"
            [class.bg-red-500]="checked() && !isCorrect()"
            [class.text-white]="checked() && !isCorrect()"
          >
            {{ checked() ? 'Continue' : 'Check Answer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ExerciseShellComponent {
  current = input.required<number>();
  total = input.required<number>();
  
  history = input<(boolean | null)[]>([]);

  stepsArray = computed(() => Array.from({ length: this.total() }));

  checked = input<boolean>(false);
  isCorrect = input<boolean>(false);
  canCheck = input<boolean>(false);
  correctLabel = input<string>('');
  rationale = input<string>('');

  check = output<void>();
  next = output<void>();

  onActionClick() {
    if (this.checked()) {
      this.next.emit();
    } else {
      this.check.emit();
    }
  }
}

