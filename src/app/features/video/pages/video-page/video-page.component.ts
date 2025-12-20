import { Component, inject, signal, ViewChild, effect, computed, OnInit } from '@angular/core';
import { LessonLeftColumnComponent } from '../../components/lesson-left-column/lesson-left-column.component';
import { LessonRightSidebarComponent } from '../../components/lesson-right-sidebar/lesson-right-sidebar.component';
import { videoPageMockData, VocabRow } from '../../data/video-page.mock';
import { SubtitleService, SubtitleLine } from '../../../../core/services/subtitle.service';
import { VocabularyService } from '../../../../core/services/vocabulary.service';
import { MyWordsRepository } from '../../../../core/repositories/my-words.repository';
import { FillBlankSetService, FillBlankSetItem } from '../../../../core/services/fill-blank-set.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonsService } from '../../../../core/services/lessons.service';
import { switchMap, map, of, catchError, shareReplay } from 'rxjs';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [LessonLeftColumnComponent, LessonRightSidebarComponent, RouterLink],
  template: `
    @if (lesson(); as meta) {
      <main class="flex-1 flex overflow-hidden w-full max-w-[1440px] mx-auto min-h-0">
        <app-lesson-left-column
          [videoUrl]="meta.videoSrc"
          [title]="meta.title"
          [levelText]="meta.level"
          [durationText]="meta.durationMin + 'm'"
          [thumbnailUrl]="meta.thumbnailUrl || ''"
          [exerciseSet]="exerciseSet()"
          (timeUpdate)="onTimeUpdate($event)"
          #leftColumn
        />
        <app-lesson-right-sidebar
          [subtitles]="subtitles() || []"
          [vocabRows]="vocabRows()"
          [currentTime]="currentTime()"
          [loopEnabled]="loopEnabled()"
          [loopCount]="loopCount()"
          (toggleLoop)="toggleLoop()"
          (setLoopCount)="setLoopCount($event)"
          (toggleWord)="onToggleWord($event)"
          (seek)="onSeek($event)"
        />
      </main>
    } @else if (isLoaded()) {
      <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <span class="material-symbols-outlined text-gray-300 dark:text-gray-600 !text-[64px] mb-4">error</span>
        <h2 class="text-2xl font-bold text-text-primary dark:text-white mb-2">Lesson not found</h2>
        <p class="text-text-secondary dark:text-gray-400 mb-8 max-w-md">
          The lesson you're looking for doesn't exist or has been moved.
        </p>
        <a 
          routerLink="/catalog"
          class="px-6 py-3 rounded-2xl bg-primary text-text-primary font-bold shadow-lg shadow-primary/20 hover:bg-[#e6e205] transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined">grid_view</span>
          Back to Catalog
        </a>
      </div>
    } @else {
      <div class="flex-1 flex flex-col items-center justify-center p-6">
        <div class="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="text-text-secondary animate-pulse font-medium">Loading lesson...</p>
      </div>
    }
  `,
  styles: [`:host { display: flex; flex: 1; min-height: 0; }`],
})
export class VideoPageComponent implements OnInit {
  private subtitleService = inject(SubtitleService);
  private vocabularyService = inject(VocabularyService);
  private myWordsRepository = inject(MyWordsRepository);
  private fillBlankSetService = inject(FillBlankSetService);
  private lessonsService = inject(LessonsService);
  private route = inject(ActivatedRoute);
  
  private lessonId$ = this.route.paramMap.pipe(
    map(params => params.get('id') || ''),
    shareReplay(1)
  );
  
  isLoaded = signal(false);

  lesson = toSignal(this.lessonId$.pipe(
    switchMap(id => this.lessonsService.getLessonById(id)),
    map(lesson => {
      this.isLoaded.set(true);
      return lesson;
    }),
    catchError(() => {
      this.isLoaded.set(true);
      return of(null);
    })
  ));

  subtitles = toSignal(this.lessonId$.pipe(
    switchMap(id => this.lessonsService.getLessonById(id)),
    switchMap(lesson => {
      if (!lesson) return of([]);
      return this.subtitleService.parseVtt(lesson.subtitlesSrc).pipe(
        catchError(err => {
          console.error('Error loading subtitles:', err);
          return of([]);
        })
      );
    })
  ));

  currentTime = signal(0);
  vocabRows = signal<VocabRow[]>([]);
  exerciseSet = signal<FillBlankSetItem[]>([]);

  activeSubtitle = computed(() => {
    const time = this.currentTime();
    return this.subtitles()?.find(s => time >= s.start && time < s.end);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      localStorage.setItem('gf.last.lessonId', id);
    }
  }

  constructor() {
    // Automatically extract vocabulary and generate exercise set when subtitles are loaded
    effect(() => {
      const lines = this.subtitles();
      if (lines && lines.length > 0) {
        // Vocabulary
        const extracted = this.vocabularyService.extractPotentialWords(lines);
        const rows: VocabRow[] = extracted.map(item => ({
          word: item.word,
          translation: item.example, // Use example as translation/context for now
          level: (item.count > 1 ? 'A2' : 'A1') as 'A1' | 'A2',
          added: this.myWordsRepository.isSaved(item.word)
        }));
        this.vocabRows.set(rows);

        // Exercise Set (Section 5.2)
        const set = this.fillBlankSetService.generateExerciseSet(lines);
        this.exerciseSet.set(set);
      }
    });
  }

  // Loop settings
  loopEnabled = signal(localStorage.getItem('gf.loop.enabled') === 'true');
  loopCount = signal<1 | 2 | 3>((Number(localStorage.getItem('gf.loop.count')) || 1) as 1 | 2 | 3);
  loopsDone = signal(0);
  lastLineKey = signal<string | null>(null);
  private lastTime = 0;
  private ignoreNextUpdate = false;

  @ViewChild('leftColumn') leftColumn!: LessonLeftColumnComponent;

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

  onToggleWord(word: string) {
    const isSaved = this.myWordsRepository.isSaved(word);
    if (isSaved) {
      this.myWordsRepository.remove(word);
    } else {
      this.myWordsRepository.add(word);
    }

    // Refresh state
    this.vocabRows.update(rows => 
      rows.map(row => row.word === word ? { ...row, added: !isSaved } : row)
    );
  }

  onSeek(time: number, isInternalLoop = false) {
    if (!isInternalLoop) {
      this.loopsDone.set(0);
    }
    this.ignoreNextUpdate = true;
    this.leftColumn.videoPlayer.seekTo(time);
  }
}
