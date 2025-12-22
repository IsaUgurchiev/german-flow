import { Component, input, output, signal, computed, ViewChild, inject, effect } from '@angular/core';
import {McqExercise} from '../models/exercise.model';
import {McqChoiceListComponent} from './mcq-choice-list/mcq-choice-list.component';
import { ExerciseProgressService } from '../../../core/services/exercise-progress';

@Component({
  template: '',
  standalone: true
})
export abstract class BaseMcqComponent {
  private progressService = inject(ExerciseProgressService);

  exercise = input.required<McqExercise>();
  current = input.required<number>();
  total = input.required<number>();
  history = input<(boolean | null)[]>([]);
  
  check = output<{ isCorrect: boolean; selectedIndex: number; userAnswer?: string }>();
  next = output<void>();

  @ViewChild(McqChoiceListComponent) choiceList?: McqChoiceListComponent;

  selectedIndex = signal<number | null>(null);
  checked = signal(false);

  constructor() {
    // Restore state from progress service when exercise changes
    effect(() => {
      const ex = this.exercise();
      if (ex) {
        const attempt = this.progressService.getAttempt((ex as any).id);
        if (attempt) {
          this.selectedIndex.set(attempt.selectedIndex ?? null);
          this.checked.set(true);
        } else {
          this.selectedIndex.set(null);
          this.checked.set(false);
        }
      }
    });
  }

  isCorrect = computed(() => {
    return this.selectedIndex() === this.exercise().answerIndex;
  });

  canCheck = computed(() => {
    return this.selectedIndex() !== null;
  });

  correctLabel = computed(() => {
    return this.exercise().choices[this.exercise().answerIndex];
  });

  onSelectionChange(index: number | null) {
    this.selectedIndex.set(index);
  }

  onCheck() {
    if (this.canCheck()) {
      this.checked.set(true);
      this.check.emit({
        isCorrect: this.isCorrect(),
        selectedIndex: this.selectedIndex()!
      });
    }
  }

  onNext() {
    this.next.emit();
    this.reset();
  }

  private reset() {
    this.selectedIndex.set(null);
    this.checked.set(false);
    this.choiceList?.reset();
  }
}

