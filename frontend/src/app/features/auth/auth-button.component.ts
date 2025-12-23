import { Component, ElementRef, ViewChild, inject, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-4">
      @if (auth.isAuthenticated()) {
        <div class="flex items-center gap-3 bg-gray-50 dark:bg-white/5 pl-1 pr-3 py-1 rounded-full border border-[#f0f0eb] dark:border-[#33332a]">
          <div class="relative size-8 flex-shrink-0">
            @if (auth.currentUser()?.avatarUrl) {
              <img 
                [src]="auth.currentUser()?.avatarUrl" 
                referrerpolicy="no-referrer"
                crossorigin="anonymous"
                class="size-full rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                alt="User avatar"
                (error)="onAvatarError()"
              />
            } @else {
              <div class="size-full rounded-full bg-primary flex items-center justify-center text-text-primary font-bold text-sm shadow-sm ring-2 ring-white dark:ring-gray-800">
                {{ (auth.currentUser()?.displayName || 'U')[0].toUpperCase() }}
              </div>
            }
          </div>
          <span class="text-sm font-bold text-text-primary dark:text-white max-w-[120px] truncate hidden sm:block">
            {{ auth.currentUser()?.displayName }}
          </span>
          <button 
            (click)="onLogout()"
            class="ml-1 p-1 hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center"
            title="Logout"
          >
            <span class="material-symbols-outlined !text-[20px]">logout</span>
          </button>
        </div>
      } @else {
        <div #googleButtonContainer class="min-h-[40px] flex items-center">
          @if (isLoading()) {
            <div class="text-xs text-text-secondary animate-pulse px-4 py-2 bg-gray-50 rounded-full border border-dashed border-gray-200">
              Loading auth...
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AuthButtonComponent implements AfterViewInit {
  auth = inject(AuthService);
  isLoading = signal(true);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        console.log('AuthButton: Current user avatar URL:', user.avatarUrl);
      }
    });
  }

  @ViewChild('googleButtonContainer') set googleButton(content: ElementRef) {
    if (content) {
      this.auth.initializeGoogleLogin(content.nativeElement);
      this.isLoading.set(false);
    }
  }

  ngAfterViewInit() {
    // If we're already logged in, no need to initialize GIS yet.
    // If not, the @ViewChild setter will handle it.
    if (!this.auth.isAuthenticated()) {
      // Small timeout to ensure script is ready if it's the first load
      setTimeout(() => {
        this.isLoading.set(false);
      }, 3000);
    }
  }

  onLogout() {
    this.auth.logout();
  }

  onAvatarError() {
    console.error('AuthButton: Failed to load avatar image from URL:', this.auth.currentUser()?.avatarUrl);
  }
}

