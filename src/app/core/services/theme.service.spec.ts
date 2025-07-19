import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockRenderer2: jasmine.SpyObj<Renderer2>;
  let localStorageSpy: { getItem: jasmine.Spy; setItem: jasmine.Spy };

  beforeEach(() => {
    mockRenderer2 = jasmine.createSpyObj('Renderer2', ['setStyle']);
    const mockRendererFactory = {
      createRenderer: () => mockRenderer2,
    };

    localStorageSpy = {
      getItem: spyOn(localStorage, 'getItem').and.returnValue(null),
      setItem: spyOn(localStorage, 'setItem'),
    };

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: RendererFactory2, useValue: mockRendererFactory }],
    });
  });

  it('devrait être créé', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  // ===================================================================
  // Tests d'Initialisation
  // ===================================================================
  describe('Initialisation du service', () => {
    it('devrait initialiser le thème sur "dark" si localStorage le contient', () => {
      localStorageSpy.getItem.and.returnValue('dark');
      service = TestBed.inject(ThemeService);
      expect(service.theme()).toBe('dark');
    });

    it('devrait initialiser le thème sur "light" si localStorage le contient', () => {
      localStorageSpy.getItem.and.returnValue('light');
      service = TestBed.inject(ThemeService);
      expect(service.theme()).toBe('light');
    });

    it('devrait utiliser les préférences "dark" du navigateur si localStorage est vide', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

      service = TestBed.inject(ThemeService);

      expect(service.theme()).toBe('dark');
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('devrait utiliser les préférences "light" du navigateur si localStorage est vide', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);

      service = TestBed.inject(ThemeService);

      expect(service.theme()).toBe('light');
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });

  describe('toggleTheme', () => {
    it('devrait basculer le thème de "light" à "dark"', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      service = TestBed.inject(ThemeService); // Initialise en 'light'

      service.toggleTheme();

      expect(service.theme()).toBe('dark');
    });

    it('devrait basculer le thème de "dark" à "light"', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      service = TestBed.inject(ThemeService); // Initialise en 'dark'

      service.toggleTheme();

      expect(service.theme()).toBe('light');
    });
  });

  describe('Effets de bord (effect)', () => {
    it("devrait appeler setStyle et setItem lors d'un changement de thème", fakeAsync(() => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      service = TestBed.inject(ThemeService); // Initialise en 'light'

      // Force l'exécution de l'effect initial après l'injection
      tick();
      expect(mockRenderer2.setStyle).toHaveBeenCalledWith(
        document.documentElement,
        'color-scheme',
        'light'
      );
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'light');

      // change le thème
      service.toggleTheme();
      expect(service.theme()).toBe('dark');

      // Attente que l'effect déclenché par le changement s'exécute
      tick();

      // Vérification des nouveaux appels
      expect(mockRenderer2.setStyle).toHaveBeenCalledWith(
        document.documentElement,
        'color-scheme',
        'dark'
      );
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');

      expect(mockRenderer2.setStyle).toHaveBeenCalledTimes(2);
      expect(localStorageSpy.setItem).toHaveBeenCalledTimes(2);
    }));
  });
});
