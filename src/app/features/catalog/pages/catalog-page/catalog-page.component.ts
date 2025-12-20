import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface LessonCard {
  id: string;
  title: string;
  level: string;
  duration: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex-1 overflow-y-auto bg-[#fcfcf9] dark:bg-[#0f0f05] p-6 md:p-10">
      <div class="max-w-6xl mx-auto">
        <header class="mb-10">
          <h1 class="text-3xl font-extrabold text-text-primary dark:text-white mb-2 italic">Video Catalog</h1>
          <p class="text-text-secondary dark:text-gray-400">Choose a lesson to start your German flow.</p>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          @for (lesson of lessons; track lesson.id) {
            <a 
              [routerLink]="['/video', lesson.id]"
              class="group bg-white dark:bg-[#1a1a0b] rounded-3xl border border-[#f0f0eb] dark:border-[#33332a] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div class="aspect-video relative overflow-hidden bg-gray-100 dark:bg-[#25251a]">
                <img 
                  [src]="lesson.thumbnailUrl" 
                  [alt]="lesson.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute top-3 left-3">
                  <span class="px-3 py-1 rounded-full bg-primary text-text-primary text-[10px] font-black uppercase tracking-wider shadow-lg">
                    {{ lesson.level }}
                  </span>
                </div>
                <div class="absolute bottom-3 right-3">
                  <span class="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[14px]">schedule</span>
                    {{ lesson.duration }}
                  </span>
                </div>
              </div>
              
              <div class="p-5 flex-1 flex flex-col">
                <h3 class="text-lg font-bold text-text-primary dark:text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                  {{ lesson.title }}
                </h3>
                
                <div class="mt-auto pt-4 border-t border-[#f0f0eb] dark:border-[#33332a] flex items-center justify-between">
                  <span class="text-xs font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <span class="material-symbols-outlined !text-[16px]">play_circle</span>
                    Start Lesson
                  </span>
                  <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: flex; flex: 1; min-height: 0; }`]
})
export class CatalogPageComponent {
  lessons: LessonCard[] = [
    {
      id: '1',
      title: 'Aladdin und die Wunderlampe',
      level: 'A2 - Intermediate',
      duration: '13:33',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFlQlVSPwcm1uAkSonM7dvZowkP5cuhc1wjixJfC1hMHF2Z2Jzd5kxfFNRmfFjqWOafbmaArDTo2BsIT7531kov0_9eJxW7F8E3NhUf5gGO0caSKcTN0IbQBFCPquGWwh-HPyqa9OpuEGMwk12m1sb0CBUOA8s22gYcLrfg3EwLzH5JCgAuGgUwH4Grb6Qn3rag6AUysg0vNWeqNOvE1zH5pmpnH3WO-7VSW_EY0Yv0JS-mQ2OiP9PYXfYliz_tDEFmWlICy3E4Pk'
    },
    {
      id: '2',
      title: 'Der Wolf und die sieben Geißlein',
      level: 'A1 - Beginner',
      duration: '08:45',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFlQlVSPwcm1uAkSonM7dvZowkP5cuhc1wjixJfC1hMHF2Z2Jzd5kxfFNRmfFjqWOafbmaArDTo2BsIT7531kov0_9eJxW7F8E3NhUf5gGO0caSKcTN0IbQBFCPquGWwh-HPyqa9OpuEGMwk12m1sb0CBUOA8s22gYcLrfg3EwLzH5JCgAuGgUwH4Grb6Qn3rag6AUysg0vNWeqNOvE1zH5pmpnH3WO-7VSW_EY0Yv0JS-mQ2OiP9PYXfYliz_tDEFmWlICy3E4Pk'
    },
    {
      id: '3',
      title: 'Rotkäppchen auf Deutsch',
      level: 'A1 - Beginner',
      duration: '10:20',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFlQlVSPwcm1uAkSonM7dvZowkP5cuhc1wjixJfC1hMHF2Z2Jzd5kxfFNRmfFjqWOafbmaArDTo2BsIT7531kov0_9eJxW7F8E3NhUf5gGO0caSKcTN0IbQBFCPquGWwh-HPyqa9OpuEGMwk12m1sb0CBUOA8s22gYcLrfg3EwLzH5JCgAuGgUwH4Grb6Qn3rag6AUysg0vNWeqNOvE1zH5pmpnH3WO-7VSW_EY0Yv0JS-mQ2OiP9PYXfYliz_tDEFmWlICy3E4Pk'
    },
    {
      id: '4',
      title: 'Hänsel und Gretel im Wald',
      level: 'B1 - Upper Intermediate',
      duration: '15:10',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAFlQlVSPwcm1uAkSonM7dvZowkP5cuhc1wjixJfC1hMHF2Z2Jzd5kxfFNRmfFjqWOafbmaArDTo2BsIT7531kov0_9eJxW7F8E3NhUf5gGO0caSKcTN0IbQBFCPquGWwh-HPyqa9OpuEGMwk12m1sb0CBUOA8s22gYcLrfg3EwLzH5JCgAuGgUwH4Grb6Qn3rag6AUysg0vNWeqNOvE1zH5pmpnH3WO-7VSW_EY0Yv0JS-mQ2OiP9PYXfYliz_tDEFmWlICy3E4Pk'
    }
  ];
}

