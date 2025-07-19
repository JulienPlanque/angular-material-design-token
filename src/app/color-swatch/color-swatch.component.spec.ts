import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSwatchComponent } from './color-swatch.component';
import { Component, input } from '@angular/core';

@Component({
  template: `
    <app-color-swatch [cssVarName]="cssVarName()" [textColorVarName]="textColorVarName()" />
  `,
  standalone: true,
  imports: [ColorSwatchComponent],
})
class TestHostComponent {
  cssVarName = input.required<string>();
  textColorVarName = input.required<string>();
}

describe('ColorSwatchComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let colorSwatchElement: HTMLElement;

  let getComputedStyleSpy: jasmine.Spy;
  let requestAnimationFrameSpy: jasmine.Spy;

  beforeEach(async () => {
    getComputedStyleSpy = spyOn(window, 'getComputedStyle').and.returnValue({
      getPropertyValue: (property: string) => {
        if (property === 'background-color') {
          return 'rgb(0, 0, 255)'; // Bleu
        }
        if (property === 'color') {
          return 'rgb(255, 255, 0)'; // Jaune
        }
        return '';
      },
    } as CSSStyleDeclaration);

    requestAnimationFrameSpy = spyOn(window, 'requestAnimationFrame').and.callFake(
      (callback: FrameRequestCallback) => {
        callback(Date.now());
        return 0;
      }
    );

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    colorSwatchElement = fixture.nativeElement.querySelector('app-color-swatch');
  });

  it('devrait être créé', () => {
    expect(hostComponent).toBeTruthy();
    expect(colorSwatchElement).toBeTruthy();
  });

  it('devrait afficher les noms des variables CSS et les couleurs calculées en HEX', () => {
    fixture.componentRef.setInput('cssVarName', '--mat-sys-primary');
    fixture.componentRef.setInput('textColorVarName', '--mat-sys-on-primary');

    fixture.detectChanges();

    const infoDivs = colorSwatchElement.querySelectorAll('.color-info');

    const bgInfoSpans = infoDivs[0].querySelectorAll('span');
    expect(bgInfoSpans[0].textContent).toBe('Background color');
    expect(bgInfoSpans[1].textContent).toContain('--mat-sys-primary');
    expect(bgInfoSpans[1].textContent).toContain('#0000FF');

    const textInfoSpans = infoDivs[1].querySelectorAll('span');
    expect(textInfoSpans[0].textContent).toBe('Text color');
    expect(textInfoSpans[1].textContent).toContain('--mat-sys-on-primary');
    expect(textInfoSpans[1].textContent).toContain('#FFFF00');
  });

  it('devrait se mettre à jour lorsque les entrées changent', () => {
    fixture.componentRef.setInput('cssVarName', '--initial-bg');
    fixture.componentRef.setInput('textColorVarName', '--initial-text');
    fixture.detectChanges();

    getComputedStyleSpy.and.returnValue({
      getPropertyValue: (property: string) => {
        if (property === 'background-color') {
          return 'rgb(255, 0, 0)';
        }
        if (property === 'color') {
          return 'rgb(255, 255, 255)';
        }
        return '';
      },
    } as CSSStyleDeclaration);

    fixture.componentRef.setInput('cssVarName', '--new-bg');
    fixture.componentRef.setInput('textColorVarName', '--new-text');

    fixture.detectChanges();

    const infoDivs = colorSwatchElement.querySelectorAll('.color-info');

    const bgInfoSpans = infoDivs[0].querySelectorAll('span');
    expect(bgInfoSpans[1].textContent).toContain('--new-bg');
    expect(bgInfoSpans[1].textContent).toContain('#FF0000');

    const textInfoSpans = infoDivs[1].querySelectorAll('span');
    expect(textInfoSpans[1].textContent).toContain('--new-text');
    expect(textInfoSpans[1].textContent).toContain('#FFFFFF');
  });

  it('devrait gérer correctement les formats de couleur non-rgb', () => {
    getComputedStyleSpy.and.returnValue({
      getPropertyValue: (property: string) => 'hotpink',
    } as CSSStyleDeclaration);

    fixture.componentRef.setInput('cssVarName', '--some-color');
    fixture.componentRef.setInput('textColorVarName', '--some-text-color');
    fixture.detectChanges();

    const infoDivs = colorSwatchElement.querySelectorAll('.color-info');

    expect(infoDivs[0].querySelectorAll('span')[1].textContent).toContain('hotpink');
    expect(infoDivs[1].querySelectorAll('span')[1].textContent).toContain('hotpink');
  });
});
