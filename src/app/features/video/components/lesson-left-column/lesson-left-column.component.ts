import { Component, input, output, ViewChild } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { LessonMetaComponent } from '../lesson-meta/lesson-meta.component';
import { ExercisesSectionComponent } from '../exercises-section/exercises-section.component';

@Component({
  selector: 'app-lesson-left-column',
  standalone: true,
  imports: [VideoPlayerComponent, LessonMetaComponent, ExercisesSectionComponent],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Video Player -->
      <app-video-player
        [videoUrl]="videoUrl()"
        [thumbnailUrl]="thumbnailUrl()"
        (timeUpdate)="timeUpdate.emit($event)"
        #videoPlayer
      />
      <!-- Title & Meta Data -->
      <app-lesson-meta
        [title]="title()"
        [levelText]="levelText()"
        [durationText]="durationText()"
      />
      <div class="h-px w-full bg-[#f0f0eb] dark:bg-[#33332a] my-2"></div>
      <!-- Exercises Section -->
      <app-exercises-section
        [tasksCount]="exercises().length"
        [exercises]="exercises()"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        padding: 1.5rem;
      }
      @media (min-width: 768px) {
        :host {
          padding: 2.5rem;
        }
      }
      @media (min-width: 1024px) {
        :host {
          padding-right: 1.5rem;
        }
      }
    `,
  ],
})
export class LessonLeftColumnComponent {
  videoUrl = input('assets/videos/lesson-1.mp4');
  title = input.required<string>();
  levelText = input.required<string>();
  durationText = input.required<string>();
  thumbnailUrl = input('');
  exercises = input.required<Array<{
    iconName: string;
    title: string;
    description: string;
    buttonText: string;
    badgeText?: string;
  }>>();

  timeUpdate = output<number>();

  @ViewChild('videoPlayer') videoPlayer!: VideoPlayerComponent;
}

