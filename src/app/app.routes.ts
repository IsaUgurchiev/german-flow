import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full',
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/pages/catalog-page/catalog-page.component').then(
        (m) => m.CatalogPageComponent
      ),
  },
  {
    path: 'video/:id',
    loadComponent: () =>
      import('./features/video/pages/video-page/video-page.component').then(
        (m) => m.VideoPageComponent
      ),
  },
];
