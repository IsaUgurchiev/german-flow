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
  seek = output<number>();
  activeTab = signal<'transcript' | 'vocabulary'>('transcript');
}

