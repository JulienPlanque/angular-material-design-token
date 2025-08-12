import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
interface Typo {
  name: string;
  tag: Tag;
  class: string;
}

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyComponent {
  readonly types: Typo[] = [
    { name: 'Display Large', tag: 'h1', class: 'display-large' },
    { name: 'Display Medium', tag: 'h2', class: 'display-medium' },
    { name: 'Display Small', tag: 'h3', class: 'display-small' },
    { name: 'Headline Large', tag: 'h4', class: 'headline-large' },
    { name: 'Headline Medium', tag: 'h5', class: 'headline-medium' },
    { name: 'Headline Small', tag: 'h6', class: 'headline-small' },
    { name: 'Title Large', tag: 'p', class: 'title-large' },
    { name: 'Title Medium', tag: 'p', class: 'title-medium' },
    { name: 'Title Small', tag: 'p', class: 'title-small' },
    { name: 'Body Large', tag: 'p', class: 'body-large' },
    { name: 'Body Medium', tag: 'p', class: 'body-medium' },
    { name: 'Body Small', tag: 'p', class: 'body-small' },
    { name: 'Label Large', tag: 'p', class: 'label-large' },
    { name: 'Label Medium', tag: 'p', class: 'label-medium' },
    { name: 'Label Small', tag: 'p', class: 'label-small' },
  ];

  sampleText = signal('Almost before we knew it, we had left the ground.');
  setSampleText(v: string) {
    this.sampleText.set(v);
  }
}
