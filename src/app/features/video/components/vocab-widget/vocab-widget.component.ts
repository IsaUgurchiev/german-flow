import { Component, input, output } from '@angular/core';
import type { VocabRow } from '../../data/video-page.mock';

@Component({
  selector: 'app-vocab-widget',
  standalone: true,
  template: `
    <div [class]="isTab() ? 'p-4' : 'border-t border-[#e6e6e0] dark:border-[#33332a] bg-gray-50 dark:bg-[#15150a] p-4 shrink-0'">
      @if (!isTab()) {
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-bold text-text-primary dark:text-white uppercase tracking-wider">Lesson Vocabulary</h4>
          <button (click)="viewAll.emit()" class="text-xs text-primary font-bold hover:underline cursor-pointer">View All</button>
        </div>
      }
      <div class="bg-white dark:bg-[#1e1e12] rounded-xl border border-[#e6e6e0] dark:border-[#33332a] overflow-hidden shadow-sm">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 dark:bg-[#25251a] text-xs uppercase text-text-secondary dark:text-gray-400">
            <tr>
              <th class="px-4 py-2 font-semibold">Word</th>
              <th class="px-2 py-2 font-semibold text-center">Lvl</th>
              <th class="px-2 py-2 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f0f0eb] dark:divide-[#33332a]">
            @for (row of vocabRows(); track row.word) {
              <tr class="hover:bg-gray-50 dark:hover:bg-[#25251a]">
                <td class="px-4 py-3">
                  <div class="font-medium text-text-primary dark:text-gray-200">{{ row.word }}</div>
                  <div class="text-xs text-text-secondary dark:text-gray-500">{{ row.translation }}</div>
                </td>
                <td class="px-2 py-3 text-center">
                  <span class="inline-flex items-center justify-center h-6 px-1.5 rounded !text-[10px] font-bold uppercase tracking-wider"
                    [class.bg-green-100]="row.level === 'A1'"
                    [class.text-green-800]="row.level === 'A1'"
                    [class.dark:bg-green-900]="row.level === 'A1'"
                    [class.dark:text-green-200]="row.level === 'A1'"
                    [class.bg-blue-100]="row.level === 'A2'"
                    [class.text-blue-800]="row.level === 'A2'"
                    [class.dark:bg-blue-900]="row.level === 'A2'"
                    [class.dark:text-blue-200]="row.level === 'A2'">
                    {{ row.level }}
                  </span>
                </td>
                <td class="px-2 py-3 text-right pr-4">
                  @if (row.added) {
                    <button 
                      (click)="toggleWord.emit(row.word)"
                      class="size-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary border-primary shadow-sm hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[16px]">check</span>
                    </button>
                  } @else {
                    <button 
                      (click)="toggleWord.emit(row.word)"
                      class="size-7 rounded-full bg-primary flex items-center justify-center text-text-primary hover:bg-[#e6e205] transition-colors shadow-sm cursor-pointer"
                    >
                      <span class="material-symbols-outlined !text-[16px]">add</span>
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class VocabWidgetComponent {
  vocabRows = input.required<VocabRow[]>();
  isTab = input<boolean>(false);
  
  toggleWord = output<string>();
  viewAll = output<void>();
}

