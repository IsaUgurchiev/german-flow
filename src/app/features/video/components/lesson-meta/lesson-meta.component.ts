import { Component, input } from '@angular/core';

@Component({
  selector: 'app-lesson-meta',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-text-primary dark:text-white text-3xl md:text-4xl font-bold leading-tight">{{ title() }}</h1>
      <div class="flex flex-wrap gap-3">
        <div class="flex h-9 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#33332a] border border-[#e6e6e0] dark:border-[#444] px-4 shadow-sm">
          <span class="material-symbols-outlined text-text-secondary dark:text-gray-300 !text-[20px]">signal_cellular_alt</span>
          <p class="text-text-primary dark:text-gray-200 text-sm font-medium">{{ levelText() }}</p>
        </div>
        <div class="flex h-9 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#33332a] border border-[#e6e6e0] dark:border-[#444] px-4 shadow-sm">
          <span class="material-symbols-outlined text-text-secondary dark:text-gray-300 !text-[20px]">schedule</span>
          <p class="text-text-primary dark:text-gray-200 text-sm font-medium">{{ durationText() }}</p>
        </div>
        <div class="flex h-9 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#33332a] border border-[#e6e6e0] dark:border-[#444] px-4 shadow-sm ml-auto cursor-pointer hover:bg-gray-50 dark:hover:bg-[#44443a]">
          <span class="material-symbols-outlined text-text-secondary dark:text-gray-300 !text-[20px]">share</span>
          <p class="text-text-primary dark:text-gray-200 text-sm font-medium">Share</p>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class LessonMetaComponent {
  title = input.required<string>();
  levelText = input.required<string>();
  durationText = input.required<string>();
}

