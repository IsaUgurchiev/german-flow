import { Component, input, inject, computed } from '@angular/core';
import { XpService } from '../services/xp.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f5f0] bg-white dark:bg-[#1a1a0b] dark:border-[#33332a] px-10 py-3 z-20">
      <div class="flex items-center gap-4 text-text-primary dark:text-white">
        <div class="size-8 flex items-center justify-center bg-primary rounded-lg text-text-primary">
          <span class="material-symbols-outlined">school</span>
        </div>
        <h2 class="text-text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">German Flow</h2>
      </div>
      <div class="flex flex-1 justify-end gap-8">
        <nav class="flex items-center gap-9 hidden md:flex">
          <a class="text-text-primary dark:text-white text-sm font-medium leading-normal hover:text-opacity-70 transition-colors" href="#">Catalog</a>
          <a class="text-text-primary dark:text-white text-sm font-medium leading-normal hover:text-opacity-70 transition-colors" href="#">My Progress</a>
        </nav>
        <div class="flex items-center gap-4">
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-text-primary text-sm font-bold leading-normal shadow-sm hover:shadow-md transition-all">
            <span class="material-symbols-outlined !text-[20px] mr-1">bolt</span>
            <span class="truncate">{{ displayXp() }}</span>
          </button>
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white shadow-sm cursor-pointer" data-alt="User profile avatar portrait" [style.background-image]="'url(' + avatarUrl() + ')'"></div>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class AppHeaderComponent {
  private xpService = inject(XpService);
  
  avatarUrl = input('https://lh3.googleusercontent.com/aida-public/AB6AXuBDWepGUi0dJKnWGYXPXwcfCSH-Y-dq6c1nRVdMIxBzzXHQHeHEQ5l7JrEdVf_wapHU0QrdTUYx_r0AmTZQDOazt82UyEOn56MgyUzkRV93eOdjKKyA1SOR2tJwS9miSyK3kxaBSBiGUso095ylxKAwctweQebQf0dWpIsE3dGOylDdMbQPOfjL9xVm9rQuOviWd4m9STDQG528jIF9CzU8vR2P41bCQ0M5BD53zl_IgVFsVW39IX62U4_StyYboIj7r6IoVkRNCBij');

  displayXp = computed(() => {
    const xp = this.xpService.getXp();
    return `${xp.toLocaleString()} XP`;
  });
}

