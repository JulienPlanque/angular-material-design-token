import { Injectable, effect, inject, signal, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public theme = signal<'light' | 'dark'>('light');
  private renderer: Renderer2;

  constructor() {
    const rendererFactory = inject(RendererFactory2);
    this.renderer = rendererFactory.createRenderer(null, null);

    this.initializeTheme();
    effect(() => {
      this.renderer.setStyle(document.documentElement, 'color-scheme', this.theme());
      localStorage.setItem('theme', this.theme());
    });
  }

  /**
   * Initialisation du thème avec la valeur sauvegardé en localStorage si existante.
   * Sinon, on récupère les préférence du navigateur pour position le thème dark ou light.
   */
  private initializeTheme() {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      this.theme.set(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }
}
