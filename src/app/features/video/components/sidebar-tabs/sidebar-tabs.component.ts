import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

type TabId = 'transcript' | 'vocabulary';

@Component({
  selector: 'app-sidebar-tabs',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex border-b border-[#e6e6e0] dark:border-[#33332a]">
      @for (tab of tabs; track tab.id) {
        <button
          class="flex-1 py-4 text-sm cursor-pointer"
          [ngClass]="activeTab() === tab.id ? activeTabClasses : notActiveTabClasses"
          (click)="onTabClick(tab.id)"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: [`:host { display: contents; }`],
})
export class SidebarTabsComponent {
  activeTab = input<TabId>('transcript');
  tabChange = output<TabId>();

  tabs: { id: TabId; label: string }[] = [
    { id: 'transcript', label: 'Transcript' },
    { id: 'vocabulary', label: 'Vocabulary' },
  ];

  activeTabClasses = 'font-bold text-text-primary dark:text-white border-b-2 border-primary bg-primary/5';
  notActiveTabClasses = 'font-medium text-text-secondary dark:text-gray-400 hover:text-text-primary hover:bg-gray-50 dark:hover:bg-[#222]';

  onTabClick(tab: TabId) {
    this.tabChange.emit(tab);
  }
}
