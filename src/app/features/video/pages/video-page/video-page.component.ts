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
        [videoUrl]="'assets/videos/lesson-1.mp4'"
        [title]="data.title"
        [levelText]="data.levelText"
        [durationText]="data.durationText"
        [thumbnailUrl]="thumbnailUrl"
        [exercises]="exercises"
        (timeUpdate)="onTimeUpdate($event)"
        #leftColumn
      />
      <app-lesson-right-sidebar
        [subtitles]="subtitles() || []"
        [vocabRows]="data.vocabRows"
        [currentTime]="currentTime()"
        [loopEnabled]="loopEnabled()"
        [loopCount]="loopCount()"
        (toggleLoop)="toggleLoop()"
        (setLoopCount)="setLoopCount($event)"
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
  subtitles = toSignal(this.subtitleService.parseVtt('assets/subtitles/lesson-1.vtt'));

  // Loop settings
  loopEnabled = signal(localStorage.getItem('gf.loop.enabled') === 'true');
  loopCount = signal<1 | 2 | 3>((Number(localStorage.getItem('gf.loop.count')) || 1) as 1 | 2 | 3);
  loopsDone = signal(0);
  lastLineKey = signal<string | null>(null);
  private lastTime = 0;
  private ignoreNextUpdate = false;

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

  onTimeUpdate(time: number) {
    if (this.ignoreNextUpdate) {
      this.ignoreNextUpdate = false;
    } else {
      this.checkLoop(time);
    }
    this.currentTime.set(time);
    this.lastTime = time;
  }

  private checkLoop(time: number) {
    if (!this.loopEnabled()) return;

    const subs = this.subtitles();
    if (!subs) return;

    // Use lastTime to find which line we were just in
    const activeLine = subs.find(s => this.lastTime >= s.start && this.lastTime < s.end);
    const lineKey = activeLine ? `${activeLine.start}-${activeLine.end}` : null;

    // Reset loopsDone when active line changes (manual seek or naturally moving to next line)
    if (lineKey !== this.lastLineKey()) {
      this.lastLineKey.set(lineKey);
      this.loopsDone.set(0);
    }

    if (!activeLine) return;

    // Check if we just crossed the end of the current active line
    if (time >= activeLine.end && this.lastTime < activeLine.end) {
      const count = this.loopCount();

      if (count === 1) {
        // Infinite loop
        this.onSeek(activeLine.start, true);
      } else if (this.loopsDone() < count - 1) {
        // Limited repetitions
        this.loopsDone.update(d => d + 1);
        this.onSeek(activeLine.start, true);
      }
    }
  }

  toggleLoop() {
    this.loopEnabled.update(v => {
      const newVal = !v;
      localStorage.setItem('gf.loop.enabled', String(newVal));
      return newVal;
    });
  }

  setLoopCount(count: number) {
    const validCount = count as 1 | 2 | 3;
    this.loopCount.set(validCount);
    localStorage.setItem('gf.loop.count', String(validCount));
    this.loopsDone.set(0);
  }

  onSeek(time: number, isInternalLoop = false) {
    if (!isInternalLoop) {
      this.loopsDone.set(0);
    }
    this.ignoreNextUpdate = true;
    this.leftColumn.videoPlayer.seekTo(time);
  }
}
