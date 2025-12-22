import {Component, effect, input, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mcq-choice-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-3">
      @for (choice of choices(); track $index) {
        <label
          class="group relative flex items-center p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all"
          [class.cursor-default]="disabled()"
          [class.border-[#e6e6e0]]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"
          [class.dark:border-[#33332a]]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"
          [class.hover:border-primary/50]="!disabled() && !isSelected($index)"
          [class.hover:bg-gray-50]="!disabled() && !isSelected($index)"
          [class.dark:hover:bg-[#25251a]]="!disabled() && !isSelected($index)"

          [class.border-primary/40]="isSelected($index) && !disabled()"
          [class.bg-primary/5]="isSelected($index) && !disabled()"

          [class.border-green-500/40]="isCorrect($index)"
          [class.bg-green-50/50]="isCorrect($index)"
          [class.dark:bg-green-900/10]="isCorrect($index)"

          [class.border-red-500/40]="isIncorrect($index)"
          [class.bg-red-50/50]="isIncorrect($index)"
          [class.dark:bg-red-900/10]="isIncorrect($index)"
        >
          <input
            type="radio"
            class="peer sr-only"
            [name]="'mcq-' + id"
            [checked]="isSelected($index)"
            [disabled]="disabled()"
            (change)="selectChoice($index)"
          />

          <!-- Radio Indicator -->
          <div
            class="flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
            [class.border-gray-300]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"
            [class.dark:border-gray-600]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"

            [class.border-primary]="isSelected($index) && !disabled()"
            [class.bg-primary]="isSelected($index) && !disabled()"

            [class.border-green-500]="isCorrect($index)"
            [class.bg-green-500]="isCorrect($index)"

            [class.border-red-500]="isIncorrect($index)"
            [class.bg-red-500]="isIncorrect($index)"
          >
            <div
              class="size-2.5 rounded-full bg-text-primary transition-transform"
              [class.scale-100]="isSelected($index) || isCorrect($index) || isIncorrect($index)"
              [class.scale-0]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"
            ></div>
          </div>

          <span
            class="ml-4 text-base md:text-lg font-medium transition-colors"
            [class.text-text-primary]="!isCorrect($index) && !isIncorrect($index)"
            [class.dark:text-gray-200]="!isCorrect($index) && !isIncorrect($index)"
            [class.text-green-700]="isCorrect($index)"
            [class.dark:text-green-400]="isCorrect($index)"
            [class.text-red-700]="isIncorrect($index)"
            [class.dark:text-red-400]="isIncorrect($index)"
          >
            {{ choice }}
          </span>

          <!-- Selection Ring -->
          <div
            class="absolute inset-0 rounded-xl ring-2 pointer-events-none transition-all"
            [class.ring-primary]="isSelected($index) && !disabled()"
            [class.ring-opacity-100]="isSelected($index) && !disabled()"
            [class.ring-green-500]="isCorrect($index)"
            [class.ring-red-500]="isIncorrect($index)"
            [class.ring-opacity-0]="!isSelected($index) && !isCorrect($index) && !isIncorrect($index)"
          ></div>

          @if (isCorrect($index)) {
            <span class="material-symbols-outlined ml-auto text-green-500">check_circle</span>
          } @else if (isIncorrect($index)) {
            <span class="material-symbols-outlined ml-auto text-red-500">cancel</span>
          }
        </label>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class McqChoiceListComponent {
  id = Math.random().toString(36).substring(7);
  choices = input.required<string[]>();
  correctIndex = input<number | null>(null);
  disabled = input<boolean>(false);

  selectedIndex = input<number | null>(null);
  selectionChange = output<number | null>();

  private internalSelectedIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.internalSelectedIndex.set(this.selectedIndex());
    });
  }

  selectChoice(index: number) {
    if (this.disabled()) return;
    this.internalSelectedIndex.set(index);
    this.selectionChange.emit(index);
  }

  isSelected(index: number): boolean {
    return this.internalSelectedIndex() === index;
  }

  isCorrect(index: number): boolean {
    return this.disabled() && index === this.correctIndex();
  }

  isIncorrect(index: number): boolean {
    return this.disabled() && this.internalSelectedIndex() === index && index !== this.correctIndex();
  }

  reset() {
    this.internalSelectedIndex.set(null);
  }
}

