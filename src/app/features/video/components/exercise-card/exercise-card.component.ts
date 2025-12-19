import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-[#1e1e12] rounded-2xl p-6 border border-[#f0f0eb] dark:border-[#33332a] shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4">
      <div class="size-12 rounded-full bg-[#f9f506]/20 flex items-center justify-center text-[#d1ce05] dark:text-primary">
        <span class="material-symbols-outlined !text-[28px]">{{ iconName() }}</span>
      </div>
      <div>
        <h4 class="text-lg font-bold text-text-primary dark:text-white mb-1">{{ title() }}</h4>
        <p class="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">{{ description() }}</p>
      </div>
      <div class="mt-auto pt-2 w-full">
        <button class="w-full h-10 rounded-full border border-[#e6e6e0] dark:border-[#444] hover:bg-background-light dark:hover:bg-[#33332a] text-text-primary dark:text-white text-sm font-bold transition-colors">
          {{ buttonText() }}@if (badgeText()) { ({{ badgeText() }}) }
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class ExerciseCardComponent {
  iconName = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  badgeText = input<string>();
}

