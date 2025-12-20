import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FillBlankExerciseItem {
  maskedText: string;
  answer: string;
}

@Component({
  selector: 'app-fill-blank-card',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white dark:bg-[#1e1e12] rounded-2xl p-6 border border-[#f0f0eb] dark:border-[#33332a] shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4">
      <div class="size-12 rounded-full bg-[#f9f506]/20 flex items-center justify-center text-[#d1ce05] dark:text-primary">
        <span class="material-symbols-outlined !text-[28px]">edit_note</span>
      </div>
      
      <div class="w-full">
        <h4 class="text-lg font-bold text-text-primary dark:text-white mb-1">Fill in the blank</h4>
        <p class="text-sm text-text-secondary dark:text-gray-400 leading-relaxed italic mb-4">
          "{{ exercise().maskedText }}"
        </p>
        
        <div class="flex flex-col gap-3 w-full">
          @if (!exercise().answer) {
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-[#25251a] text-text-secondary dark:text-gray-500 text-xs font-medium border border-dashed border-gray-200 dark:border-gray-800">
              Нет подходящих слов для упражнения в этой строке.
            </div>
          } @else {
            <input 
              type="text" 
              [(ngModel)]="userAnswer"
              (keyup.enter)="checkAnswer()"
              [disabled]="isCorrect()"
              placeholder="Type the missing word..."
              class="w-full h-10 px-4 rounded-xl border border-[#e6e6e0] dark:border-[#444] bg-transparent text-text-primary dark:text-white text-sm focus:border-primary outline-none transition-colors"
              [class.border-green-500]="isCorrect()"
              [class.bg-green-500/5]="isCorrect()"
            />
            
            @if (isCorrect()) {
              <div class="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold animate-in fade-in slide-in-from-left-2">
                <span class="material-symbols-outlined !text-[16px]">check_circle</span>
                Richtig! Good job.
              </div>
            } @else if (showError()) {
              <div class="flex items-center gap-2 text-red-500 text-xs font-bold animate-in shake duration-300">
                <span class="material-symbols-outlined !text-[16px]">error</span>
                Try again!
              </div>
            }
            
            <button 
              (click)="checkAnswer()"
              [disabled]="isCorrect() || !userAnswer().trim()"
              class="w-full h-10 rounded-full bg-primary text-text-primary text-sm font-bold hover:bg-[#e6e205] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer mt-1"
            >
              {{ isCorrect() ? 'Completed' : 'Check Answer' }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`]
})
export class FillBlankCardComponent {
  exercise = input.required<FillBlankExerciseItem>();
  
  userAnswer = signal('');
  isCorrect = signal(false);
  showError = signal(false);

  checkAnswer() {
    const answer = this.exercise().answer;
    if (!answer) return;

    const normalizedUser = this.userAnswer().toLowerCase().trim().replace(/[.,!?;:()"]/g, '');
    const normalizedCorrect = answer.toLowerCase().trim().replace(/[.,!?;:()"]/g, '');
    
    if (normalizedUser === normalizedCorrect) {
      this.isCorrect.set(true);
      this.showError.set(false);
    } else {
      this.showError.set(true);
      setTimeout(() => this.showError.set(false), 2000);
    }
  }
}

