import { Routes } from '@angular/router';
import { DesignSystemComponent } from './features/design-system/design-system.component';

export const routes: Routes = [
  {
    path: '', // Quand le chemin est vide (racine du site)
    redirectTo: 'home', // Redirige vers '/home'
    pathMatch: 'full', // La redirection ne s'applique que si le chemin est exactement vide
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'design-system',
    loadComponent: () =>
      import('./features/design-system/design-system.component').then(m => m.DesignSystemComponent),
    //component: DesignSystemComponent,
    children: [
      { path: '', redirectTo: 'buttons', pathMatch: 'full' },
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
