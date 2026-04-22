import { Injectable, signal, computed, effect } from '@angular/core';
import { es } from './languages/es';
import { en } from './languages/en';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  // Current language signal
  private readonly _currentLang = signal<Language>(this.getInitialLanguage());
  
  // Public read-only signal
  readonly currentLang = this._currentLang.asReadonly();

  // Dictionaries
  private readonly dictionaries: Record<Language, any> = { es, en };

  // Computed signal for the active dictionary
  readonly dictionary = computed(() => this.dictionaries[this._currentLang()]);

  constructor() {
    // Persist language changes to localStorage
    effect(() => {
      localStorage.setItem('viking_lang', this._currentLang());
    });
  }

  /**
   * Translates a key by searching it in the current dictionary.
   * Supports nested keys like 'NAV.HOME'
   */
  translate(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let result = this.dictionary();
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; 
      }
    }
    
    if (typeof result !== 'string') return key;

    // Replace parameters {{ key }}
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        result = (result as string).replace(new RegExp(`{{ ${paramKey} }}`, 'g'), value);
      });
    }
    
    return result;
  }

  /**
   * Switches the current language
   */
  setLanguage(lang: Language) {
    this._currentLang.set(lang);
  }

  /**
   * Toggles between available languages
   */
  toggleLanguage() {
    this.setLanguage(this._currentLang() === 'es' ? 'en' : 'es');
  }

  /**
   * Determines the initial language based on localStorage or browser settings
   */
  private getInitialLanguage(): Language {
    const saved = localStorage.getItem('viking_lang') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  }
}
