import { AfterViewInit, Component, ElementRef, ViewChild, input, signal, output } from '@angular/core';

@Component({
  selector: 'app-video-player',
  standalone: true,
  template: `
    <div #container class="w-full bg-black rounded-2xl overflow-hidden shadow-lg group relative aspect-video">
      <video
        #videoPlayer
        class="w-full h-full object-cover"
        [src]="videoUrl()"
        (click)="togglePlay()"
      ></video>

      @if (!isPlaying()) {
        <div class="absolute inset-0 bg-black/20 flex items-center justify-center z-10 pointer-events-none">
          <button (click)="togglePlay()" class="pointer-events-auto flex shrink-0 items-center justify-center rounded-full size-20 bg-primary text-text-primary shadow-xl hover:scale-105 transition-transform duration-200 pl-1">
            <span class="material-symbols-outlined !text-[40px]">play_arrow</span>
          </button>
        </div>
      }

      <!-- Video Controls Overlay (Mock/Interactive) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 text-white">
        <span class="material-symbols-outlined cursor-pointer" (click)="togglePlay()">
          {{ isPlaying() ? 'pause' : 'play_arrow' }}
        </span>

        <div
          class="h-1 flex-1 bg-white/30 rounded-full overflow-hidden cursor-pointer group/progress relative"
          (click)="handleProgressBarClick($event)"
        >
          <div class="h-full bg-primary" [style.width.%]="progress()"></div>
        </div>

        <span class="text-xs font-medium">{{ currentTimeLabel() }} / {{ totalTimeLabel() }}</span>

        <span class="material-symbols-outlined cursor-pointer" (click)="toggleMute()">
          {{ isMuted() ? 'volume_off' : 'volume_up' }}
        </span>

        <span class="material-symbols-outlined cursor-pointer" (click)="toggleFullscreen()">
          fullscreen
        </span>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class VideoPlayerComponent implements AfterViewInit {
  videoUrl = input('');
  thumbnailUrl = input('');
  timeUpdate = output<number>();

  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('container') containerElement!: ElementRef<HTMLDivElement>;

  isPlaying = signal(false);
  isMuted = signal(false);
  progress = signal(0);
  currentTimeLabel = signal('00:00');
  totalTimeLabel = signal('00:00');

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    video.ontimeupdate = () => {
      if (video.duration) {
        this.progress.set((video.currentTime / video.duration) * 100);
      }
      this.currentTimeLabel.set(this.formatTime(video.currentTime));
      this.timeUpdate.emit(video.currentTime);
    };

    video.onloadedmetadata = () => {
      this.totalTimeLabel.set(this.formatTime(video.duration));
    };

    video.onplay = () => this.isPlaying.set(true);
    video.onpause = () => this.isPlaying.set(false);
    video.onvolumechange = () => this.isMuted.set(video.muted);
  }

  handleProgressBarClick(event: MouseEvent) {
    const video = this.videoElement.nativeElement;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  }

  togglePlay() {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  toggleMute() {
    const video = this.videoElement.nativeElement;
    video.muted = !video.muted;
  }

  toggleFullscreen() {
    const container = this.containerElement.nativeElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  seekTo(time: number) {
    const video = this.videoElement.nativeElement;
    video.currentTime = time;
    if (video.paused) {
      video.play().catch(() => {});
    }
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

