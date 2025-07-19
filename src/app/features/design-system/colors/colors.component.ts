import { Component } from '@angular/core';
import { ColorSwatchComponent } from '../../../color-swatch/color-swatch.component';

@Component({
  selector: 'app-colors',
  imports: [ColorSwatchComponent],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
})
export class ColorsComponent {}
