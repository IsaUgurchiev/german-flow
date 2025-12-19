import { Component, inject, signal, ViewChild } from '@angular/core';
import { LessonLeftColumnComponent } from '../../components/lesson-left-column/lesson-left-column.component';
import { LessonRightSidebarComponent } from '../../components/lesson-right-sidebar/lesson-right-sidebar.component';
import { videoPageMockData } from '../../data/video-page.mock';
import { SubtitleService, SubtitleLine } from '../../../../core/services/subtitle.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [LessonLeftColumnComponent, LessonRightSidebarComponent],
  template: `
    <main class="flex-1 flex overflow-hidden w-full max-w-[1440px] mx-auto min-h-0">
      <app-lesson-left-column
        [videoUrl]="'/assets/videos/lesson-1.mp4'"
        [title]="data.title"
        [levelText]="data.levelText"
        [durationText]="data.durationText"
        [thumbnailUrl]="thumbnailUrl"
        [exercises]="exercises"
        (timeUpdate)="currentTime.set($event)"
        #leftColumn
      />
      <app-lesson-right-sidebar
        [subtitles]="subtitles() || []"
        [vocabRows]="data.vocabRows"
        [currentTime]="currentTime()"
        (seek)="onSeek($event)"
      />
    </main>
  `,
  styles: [`:host { display: flex; flex: 1; min-height: 0; }`],
})
export class VideoPageComponent {
  private subtitleService = inject(SubtitleService);
  
  data = videoPageMockData;
  thumbnailUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFlQlVSPwcm1uAkSonM7dvZowkP5cuhc1wjixJfC1hMHF2Z2Jzd5kxfFNRmfFjqWOafbmaArDTo2BsIT7531kov0_9eJxW7F8E3NhUf5gGO0caSKcTN0IbQBFCPquGWwh-HPyqa9OpuEGMwk12m1sb0CBUOA8s22gYcLrfg3EwLzH5JCgAuGgUwH4Grb6Qn3rag6AUysg0vNWeqNOvE1zH5pmpnH3WO-7VSW_EY0Yv0JS-mQ2OiP9PYXfYliz_tDEFmWlICy3E4Pk';
  
  currentTime = signal(0);
  subtitles = toSignal(this.subtitleService.parseVtt('/assets/subtitles/lesson-1.vtt'));

  @ViewChild('leftColumn') leftColumn!: LessonLeftColumnComponent;

  exercises = [
    {
      iconName: 'quiz',
      title: 'Comprehension Check',
      description: 'Test your understanding of the dialogue in the cafe scene.',
      buttonText: 'Start Quiz',
      badgeText: '3 Questions',
    },
    {
      iconName: 'edit_note',
      title: 'Grammar: Accusative',
      description: 'Fill in the blanks using the correct accusative case articles.',
      buttonText: 'Start Practice',
      badgeText: '5 Questions',
    },
  ];

  onSeek(time: number) {
    this.leftColumn.videoPlayer.seekTo(time);
  }
}

