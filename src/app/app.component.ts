import { Component, effect, inject, Signal, viewChildren } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ColorSwatchComponent } from './color-swatch/color-swatch.component';
import { ThemeService } from './core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public themeService = inject(ThemeService);
  private breakpointObserver = inject(BreakpointObserver);

  public isMobile: Signal<boolean> = toSignal(
    this.breakpointObserver.observe('(max-width: 600px)').pipe(map(result => result.matches)),
    { initialValue: false }
  );

  // `viewChildren` retourne un signal contenant la liste des composants.
  // C'est la méthode moderne pour remplacer @ViewChildren.
  colorSwatches = viewChildren(ColorSwatchComponent);

  constructor() {
    effect(() => {
      // L'effet se déclenchera automatiquement si le signal `theme` OU le signal `colorSwatches` change.
      const theme = this.themeService.theme();
      const swatches = this.colorSwatches();

      // On vérifie que la liste des composants n'est pas vide avant de la parcourir.
      if (swatches.length) {
        swatches.forEach(swatch => swatch.updateComputedColor());
      }
    });
  }

  logout(): void {
    alert('déconnecté');
  }
}
