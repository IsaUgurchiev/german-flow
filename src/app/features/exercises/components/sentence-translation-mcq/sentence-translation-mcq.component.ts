import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMcqComponent } from '../base-mcq.component';
import { ExerciseShellComponent } from '../exercise-shell/exercise-shell.component';
import { McqChoiceListComponent } from '../mcq-choice-list/mcq-choice-list.component';

@Component({
  selector: 'app-sentence-translation-mcq',
  standalone: true,
  imports: [CommonModule, ExerciseShellComponent, McqChoiceListComponent],
  template: `
    <app-exercise-shell
      [current]="current()"
      [total]="total()"
      [history]="history()"
      [checked]="checked()"
      [isCorrect]="isCorrect()"
      [canCheck]="canCheck()"
      [correctLabel]="correctLabel()"
      [rationale]="exercise().rationale || ''"
      (check)="onCheck()"
      (next)="onNext()"
    >
      <div class="flex flex-col gap-8">
        <div>
          <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest mb-3 block">German:</span>
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-[#25251a] border-2 border-[#f0f0eb] dark:border-[#33332a]">
            <h3 class="text-xl font-bold text-text-primary dark:text-white leading-relaxed whitespace-pre-wrap">
              {{ exercise().sourceRef?.text || exercise().prompt }}
            </h3>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest mb-3 block">
            Choose the best English translation:
          </span>
          <app-mcq-choice-list
            [choices]="exercise().choices"
            [correctIndex]="exercise().answerIndex"
            [disabled]="checked()"
            [selectedIndex]="selectedIndex()"
            (selectionChange)="onSelectionChange($event)"
          ></app-mcq-choice-list>
        </div>
      </div>
    </app-exercise-shell>
  `
})
export class SentenceTranslationMcqComponent extends BaseMcqComponent {}

