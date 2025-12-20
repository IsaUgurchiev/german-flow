import { Component, input } from '@angular/core';
import { FillBlankCardComponent } from '../fill-blank-card/fill-blank-card.component';
import { FillBlankSetItem } from '../../../../core/services/fill-blank-set.service';

@Component({
  selector: 'app-exercises-section',
  standalone: true,
  imports: [FillBlankCardComponent],
  template: `
    <div class="flex flex-col gap-4 pb-12">
      <div class="flex items-center justify-between">
        <h3 class="text-text-primary dark:text-white text-xl font-bold">Exercises</h3>
        <span class="text-sm text-text-secondary dark:text-gray-400 font-medium">
          {{ exerciseSet().length }} Tasks available
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (ex of exerciseSet(); track ex.id) {
          <app-fill-blank-card
            [exercise]="ex"
          />
        } @empty {
          <div class="col-span-full py-12 px-6 rounded-3xl border-2 border-dashed border-[#f0f0eb] dark:border-[#33332a] flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 !text-[64px] mb-4">pending_actions</span>
            <p class="text-text-primary dark:text-white font-bold mb-1">
              No exercises generated yet
            </p>
            <p class="text-text-secondary dark:text-gray-500 text-sm max-w-xs">
              Subtitles are required to generate fill-in-the-blank tasks for this lesson.
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class ExercisesSectionComponent {
  exerciseSet = input<FillBlankSetItem[]>([]);
}

