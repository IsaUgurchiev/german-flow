import { Component, input, effect, ElementRef, inject, output } from '@angular/core';

@Component({
  selector: 'app-transcript-item',
  standalone: true,
  template: `
    <div
      class="group p-3 rounded-xl cursor-pointer transition-all duration-300 border my-1 scroll-mt-20"
      [class.bg-primary/10]="active()"
      [class.border-primary/20]="active()"
      [class.border-transparent]="!active()"
      [class.hover:bg-background-light]="!active()"
      [class.dark:hover:bg-[#25251a]]="!active()"
      [class.opacity-60]="dimmed() && !active()"
      (click)="seek.emit(start())"
    >
      <div class="flex gap-3">
        <span class="text-xs font-bold pt-1 font-mono transition-colors duration-300" [class.text-text-primary]="active()" [class.dark:text-primary]="active()" [class.text-text-secondary]="!active()" [class.dark:text-gray-500]="!active()">
          {{ timeLabel() }}
        </span>
        <div class="transition-all duration-300 flex-1">
          <p class="leading-relaxed transition-all duration-300" [class.text-lg]="active()" [class.font-medium]="active()" [class.text-text-primary]="active()" [class.dark:text-white]="active()" [class.text-base]="!active()" [class.text-text-primary]="!active() && !dimmed()" [class.dark:text-gray-300]="!active()">
            {{ text() }}
          </p>
          @if (translation()) {
            <p class="text-sm text-text-secondary dark:text-gray-500 italic mt-1">{{ translation() }}</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class TranscriptItemComponent {
  timeLabel = input.required<string>();
  start = input.required<number>();
  text = input.required<string>();
  translation = input<string>();
  active = input(false);
  dimmed = input(false);
  seek = output<number>();

  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      if (this.active()) {
        // Ждем завершения цикла рендеринга, чтобы позиция элемента была актуальной
        setTimeout(() => {
          this.el.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    });
  }
}

