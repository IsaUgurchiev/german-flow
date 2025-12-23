import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMcqComponent } from '../base-mcq.component';
import { ExerciseShellComponent } from '../exercise-shell/exercise-shell.component';
import { McqChoiceListComponent } from '../mcq-choice-list/mcq-choice-list.component';

@Component({
  selector: 'app-word-translation-mcq',
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
        <div class="text-center py-4">
          <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest mb-3 block">Translate this word</span>
          <h3 class="text-3xl font-black text-text-primary dark:text-white">
            {{ exercise().prompt }}
          </h3>
          @if (exercise().contextText) {
            <p class="mt-4 text-text-secondary dark:text-gray-400 italic bg-gray-50 dark:bg-[#25251a] p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              "{{ exercise().contextText }}"
            </p>
          }
        </div>

        <app-mcq-choice-list
          [choices]="exercise().choices"
          [correctIndex]="exercise().answerIndex"
          [disabled]="checked()"
          [selectedIndex]="selectedIndex()"
          (selectionChange)="onSelectionChange($event)"
        ></app-mcq-choice-list>
      </div>
    </app-exercise-shell>
  `
})
export class WordTranslationMcqComponent extends BaseMcqComponent {}

