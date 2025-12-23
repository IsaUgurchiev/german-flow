import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../header/app-header.component';
import { SyncService } from '../services/sync.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  template: `
    <div class="bg-background-light dark:bg-background-dark font-display text-text-primary antialiased h-screen flex flex-col overflow-hidden">
      <app-header />

      <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100vh; }`],
})
export class AppShellComponent {
  private syncService = inject(SyncService);
}

