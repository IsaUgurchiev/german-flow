import { Component, input, inject, computed } from '@angular/core';
import { FillBlankCardComponent } from '../fill-blank-card/fill-blank-card.component';
import { FillBlankService } from '../../../../core/services/fill-blank.service';

@Component({
  selector: 'app-exercises-section',
  standalone: true,
  imports: [FillBlankCardComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-text-primary dark:text-white text-xl font-bold">Exercises</h3>
        <span class="text-sm text-text-secondary dark:text-gray-400 font-medium">
          {{ exercise() ? '1 Task' : '0 Tasks' }} available
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @if (exercise(); as ex) {
          <app-fill-blank-card
            [maskedText]="ex.maskedText"
            [correctAnswer]="ex.answer"
          />
        } @else {
          <div class="col-span-full py-8 px-6 rounded-2xl border-2 border-dashed border-[#f0f0eb] dark:border-[#33332a] flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 !text-[48px] mb-2">pending_actions</span>
            <p class="text-text-secondary dark:text-gray-500 text-sm">
              Play the video to generate exercises based on the dialogue.
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class ExercisesSectionComponent {
  private fillBlankService = inject(FillBlankService);
  activeSubtitle = input<string>('');

  exercise = computed(() => {
    const text = this.activeSubtitle();
    return text ? this.fillBlankService.generateExercise(text) : null;
  });
}

