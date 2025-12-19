import { Component, input } from '@angular/core';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';

@Component({
  selector: 'app-exercises-section',
  standalone: true,
  imports: [ExerciseCardComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="text-text-primary dark:text-white text-xl font-bold">Exercises</h3>
        <span class="text-sm text-text-secondary dark:text-gray-400 font-medium">{{ tasksCount() }} Tasks available</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (exercise of exercises(); track exercise.title) {
          <app-exercise-card
            [iconName]="exercise.iconName"
            [title]="exercise.title"
            [description]="exercise.description"
            [buttonText]="exercise.buttonText"
            [badgeText]="exercise.badgeText"
          />
        }
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class ExercisesSectionComponent {
  tasksCount = input(2);
  exercises = input.required<Array<{
    iconName: string;
    title: string;
    description: string;
    buttonText: string;
    badgeText?: string;
  }>>();
}

