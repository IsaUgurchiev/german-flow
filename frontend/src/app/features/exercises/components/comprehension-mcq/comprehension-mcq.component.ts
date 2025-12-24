import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMcqComponent } from '../base-mcq.component';
import { ExerciseShellComponent } from '../exercise-shell/exercise-shell.component';
import { McqChoiceListComponent } from '../mcq-choice-list/mcq-choice-list.component';

@Component({
  selector: 'app-comprehension-mcq',
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
      (goTo)="goTo.emit($event)"
    >
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest block">Read and understand</span>
          @if (exercise().contextText) {
            <div class="p-5 rounded-2xl bg-primary/5 border-l-4 border-primary italic text-text-primary dark:text-gray-200 leading-relaxed">
              {{ exercise().contextText }}
            </div>
          }
          <h3 class="text-lg font-bold text-text-primary dark:text-white">
            {{ exercise().prompt }}
          </h3>
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
export class ComprehensionMcqComponent extends BaseMcqComponent {}

