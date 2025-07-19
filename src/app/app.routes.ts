import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'design-system',
    loadComponent: () =>
      import('./features/design-system/design-system.component').then(m => m.DesignSystemComponent),
    children: [
      {
        path: 'buttons',
        loadComponent: () =>
          import('./features/design-system/buttons/buttons.component').then(
            m => m.ButtonsComponent
          ),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./features/design-system/typography/typography.component').then(
            m => m.TypographyComponent
          ),
      },
      {
        path: 'colors',
        loadComponent: () =>
          import('./features/design-system/colors/colors.component').then(m => m.ColorsComponent),
      },
    ],
  },
];
