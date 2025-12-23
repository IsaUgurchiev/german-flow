import { Component, input, inject, computed, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { XpService } from '../services/xp.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f5f0] bg-white dark:bg-[#1a1a0b] dark:border-[#33332a] px-10 py-3 z-20">
      <a routerLink="/" class="flex items-center gap-4 text-text-primary dark:text-white hover:opacity-80 transition-opacity">
        <div class="size-8 flex items-center justify-center bg-primary rounded-lg text-text-primary">
          <span class="material-symbols-outlined">school</span>
        </div>
        <h2 class="text-text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">German Flow</h2>
      </a>
      <div class="flex flex-1 justify-end gap-8">
        <nav class="flex items-center gap-9 hidden md:flex">
          <a class="text-text-primary dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" routerLink="/catalog">Catalog</a>
          <a class="text-text-primary dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" routerLink="/progress">My Progress</a>
        </nav>
        <div class="flex items-center gap-4">
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-text-primary text-sm font-bold leading-normal shadow-sm hover:shadow-md transition-all">
            <span class="material-symbols-outlined !text-[20px] mr-1">bolt</span>
            <span class="truncate">{{ displayXp() }}</span>
          </button>
          
          @if (auth.isAuthenticated()) {
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-text-secondary hidden sm:block">{{ auth.currentUser()?.first_name }}</span>
              <div 
                (click)="auth.logout()"
                title="Logout"
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white shadow-sm cursor-pointer" 
                data-alt="User profile avatar portrait" 
                [style.background-image]="'url(' + avatarUrl() + ')'"
              ></div>
            </div>
          } @else {
            <div #googleButtonContainer></div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class AppHeaderComponent {
  private xpService = inject(XpService);
  auth = inject(AuthService);
  
  @ViewChild('googleButtonContainer') set googleButton(content: ElementRef) {
    if (content) {
      this.auth.initializeGoogleLogin(content.nativeElement);
    }
  }

  avatarUrl = input('https://ui-avatars.com/api/?name=User&background=f0f000&color=1a1a0b');

  displayXp = computed(() => {
    const xp = this.xpService.getXp();
    return `${xp.toLocaleString()} XP`;
  });
}

