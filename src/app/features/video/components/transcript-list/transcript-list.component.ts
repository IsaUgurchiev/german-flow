import { Component, input, output } from '@angular/core';
import { TranscriptItemComponent } from '../transcript-item/transcript-item.component';
import type { SubtitleLine } from '../../../../core/services/subtitle.service';

@Component({
  selector: 'app-transcript-list',
  standalone: true,
  imports: [TranscriptItemComponent],
  template: `
    <div class="flex flex-col p-2 pb-24">
      @for (line of subtitles(); track $index) {
        <app-transcript-item
          [timeLabel]="formatTime(line.start)"
          [start]="line.start"
          [text]="line.text"
          [active]="currentTime() >= line.start && currentTime() < line.end"
          [dimmed]="currentTime() > line.end"
          (seek)="seek.emit($event)"
        />
      }
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class TranscriptListComponent {
  subtitles = input.required<SubtitleLine[]>();
  currentTime = input.required<number>();
  seek = output<number>();

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

