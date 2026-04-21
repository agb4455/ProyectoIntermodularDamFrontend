import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme } from './theme.model';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock de localStorage
    localStorageMock = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    // Mock de matchMedia (preferencia dark por defecto)
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    } as any);

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('theme_shouldInitializeFromSystemPreference_whenNoStoredTheme', () => {
    // matchMedia devuelve matches: true (dark) en el beforeEach
    expect(service.theme()).toBe('dark');
  });

  it('toggle_shouldSwitchThemes', () => {
    // Asumiendo inicio en 'dark'
    expect(service.theme()).toBe('dark');

    // Ejecutar
    service.toggle();

    // Verificar
    expect(service.theme()).toBe('light');

    // Volver a cambiar
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('setTheme_shouldApplyExplicitTheme', () => {
    service.setTheme('light');
    expect(service.theme()).toBe('light');

    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
  });

  it('effect_shouldUpdateDocumentAndLocalStorage', (done) => {
    // El efecto se ejecuta asíncronamente en el microtask queue
    service.setTheme('light');

    // Usamos setTimeout para esperar a que el efecto de Angular se procese
    // Nota: En Angular 20 con signals/effects, esto suele ser automático en el siguiente ciclo
    setTimeout(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      done();
    });
  });
});
