import { Component, input, signal, output } from '@angular/core';
import { SidebarTabsComponent } from '../sidebar-tabs/sidebar-tabs.component';
import { TranscriptListComponent } from '../transcript-list/transcript-list.component';
import { VocabWidgetComponent } from '../vocab-widget/vocab-widget.component';
import type { VocabRow } from '../../data/video-page.mock';
import type { SubtitleLine } from '../../../../core/services/subtitle.service';

@Component({
  selector: 'app-lesson-right-sidebar',
  standalone: true,
  imports: [SidebarTabsComponent, TranscriptListComponent, VocabWidgetComponent],
  template: `
    <div class="w-[380px] hidden lg:flex flex-col border-l border-[#e6e6e0] dark:border-[#33332a] bg-white dark:bg-[#1a1a0b] h-full shrink-0">
      <!-- Tabs -->
      <app-sidebar-tabs [activeTab]="activeTab()" (tabChange)="activeTab.set($event)" />
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto custom-scroll relative">
        @if (activeTab() === 'transcript') {
          <!-- Loop Controls -->
          <div class="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-[#e6e6e0] dark:border-[#33332a] bg-white/95 dark:bg-[#1a1a0b]/95 backdrop-blur-sm">
            <button
              (click)="toggleLoop.emit()"
              [class]="'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ' +
                       (loopEnabled() ? 'bg-primary/10 border-primary/50 text-primary shadow-sm' : 'bg-transparent border-[#e6e6e0] dark:border-[#33332a] text-[#66665c] dark:text-[#99998a] hover:border-[#cbcbc0]')"
            >
              <span class="material-symbols-outlined !text-[18px]">repeat</span>
              <span class="text-xs font-semibold cursor-pointer">Loop line</span>
            </button>

            @if (loopEnabled()) {
              <div class="flex bg-[#f0f0eb] dark:bg-[#2a2a1a] rounded-lg p-1 gap-1">
                @for (count of [1, 2, 3]; track count) {
                  <button
                    (click)="setLoopCount.emit(count)"
                    [class]="'min-w-[32px] px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ' +
                             (loopCount() === count ? 'bg-white dark:bg-[#44443a] shadow-sm text-primary' : 'text-[#66665c] dark:text-[#99998a] hover:text-primary')"
                  >
                    {{ count === 1 ? '∞' : count + 'x' }}
                  </button>
                }
              </div>
            }
          </div>

          <app-transcript-list
            [subtitles]="subtitles()"
            [currentTime]="currentTime()"
            (seek)="seek.emit($event)"
          />
        }
      </div>
      <!-- Vocab Widget (Fixed at bottom of right column) -->
      <app-vocab-widget [vocabRows]="vocabRows()" />
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class LessonRightSidebarComponent {
  subtitles = input.required<SubtitleLine[]>();
  vocabRows = input.required<VocabRow[]>();
  currentTime = input.required<number>();
  loopEnabled = input<boolean>(false);
  loopCount = input<1 | 2 | 3>(1);

  seek = output<number>();
  toggleLoop = output<void>();
  setLoopCount = output<number>();

  activeTab = signal<'transcript' | 'vocabulary'>('transcript');
}
