import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { AppConfigService } from './core/config/app-config.service';

/**
 * Fábrica para el APP_INITIALIZER: carga `assets/config.json` en bootstrap.
 * Angular esperará a que la promesa se resuelva antes de renderizar nada.
 */
function initializeApp(configService: AppConfigService): () => Promise<void> {
  return () => configService.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Necesario para AppConfigService y AuthApiService
    provideHttpClient(),
    // Carga la configuración de entorno antes de cualquier componente
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
  ]
};

