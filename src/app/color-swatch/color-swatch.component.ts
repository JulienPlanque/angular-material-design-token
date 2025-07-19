import { ChangeDetectorRef, Component, effect, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'app-color-swatch',
  imports: [],
  templateUrl: './color-swatch.component.html',
  styleUrl: './color-swatch.component.scss',
  host: {
    '[style.backgroundColor]': 'backgroundColor()',
    '[style.color]': 'textColor()',
  },
})
export class ColorSwatchComponent {
  cssVarName = input.required<string>();
  textColorVarName = input.required<string>();

  private elRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  computedBgColor: string = '';
  computedTextColor: string = '';

  backgroundColor() {
    return `var(${this.cssVarName()})`;
  }

  textColor() {
    return `var(${this.textColorVarName()})`;
  }

  constructor() {
    effect(() => {
      this.cssVarName();
      this.textColorVarName();
      this.updateComputedColor();
    });
  }

  updateComputedColor(): void {
    requestAnimationFrame(() => {
      const styles = window.getComputedStyle(this.elRef.nativeElement);

      // On récupère et convertit la couleur de fond
      const bgColor = styles.getPropertyValue('background-color');
      this.computedBgColor = this.rgbToHex(bgColor);

      // On récupère et convertit la couleur du texte
      const textColor = styles.getPropertyValue('color');
      this.computedTextColor = this.rgbToHex(textColor);

      this.cdr.detectChanges();
    });
  }
  /**
   * Convertit une chaîne de couleur rgb(r, g, b) en code hexadécimal #RRGGBB.
   * @param rgb La chaîne de couleur RGB.
   * @returns Le code hexadécimal correspondant.
   */
  private rgbToHex(rgb: string): string {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      return rgb; // Retourne la valeur originale si le format n'est pas reconnu
    }

    const toHex = (c: number): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }
}
