import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'video/1',
    pathMatch: 'full',
  },
  {
    path: 'video/:id',
    loadComponent: () =>
      import('./features/video/pages/video-page/video-page.component').then(
        (m) => m.VideoPageComponent
      ),
  },
];
