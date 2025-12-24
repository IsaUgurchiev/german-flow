import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between mb-8">
      <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest">
        Question {{ current() }} / {{ total() }}
      </span>
      <div class="flex gap-1.5">
        @for (step of stepsArray(); track $index) {
          <button 
            (click)="goTo.emit($index)"
            class="h-2 w-10 rounded-full transition-all duration-500 cursor-pointer hover:scale-y-125 disabled:cursor-default"
            [disabled]="$index === current() - 1"
            [class.bg-green-500]="history()[$index] === true"
            [class.bg-red-500]="history()[$index] === false"
            [class.bg-primary]="$index === current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
            [class.bg-[#f0f0eb]]="$index !== current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
            [class.dark:bg-[#33332a]]="$index !== current() - 1 && (history()[$index] === null || history()[$index] === undefined)"
          ></button>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; width: 100%; }`]
})
export class ExerciseProgressComponent {
  current = input.required<number>();
  total = input.required<number>();
  history = input<(boolean | null)[]>([]);
  goTo = output<number>();

  stepsArray = computed(() => Array.from({ length: this.total() }));
}

