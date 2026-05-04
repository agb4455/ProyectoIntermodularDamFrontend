import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { AppConfig } from './app-config.model';

/**
 * Servicio de configuración de entorno.
 * Carga `assets/config.json` en el arranque de la app (vía APP_INITIALIZER)
 * para que la URL del Middle Server esté disponible antes de cualquier componente.
 *
 * Uso: inyectar `AppConfigService` y llamar a `config.middleServerUrl`.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);

  // Valores por defecto (desarrollo local) — se sobreescriben al cargar el JSON
  private _config: AppConfig = { middleServerUrl: '' };

  /** Devuelve la configuración cargada */
  get config(): AppConfig {
    return this._config;
  }

  /**
   * Carga el fichero de configuración externo.
   * Si no se puede cargar (p.ej. en tests o si el fichero falta),
   * se mantienen los valores por defecto para no bloquear el arranque.
   */
  async load(): Promise<void> {
    this._config = await firstValueFrom(
      this.http.get<AppConfig>('assets/config.json').pipe(
        catchError(() => {
          // Fichero no disponible — se usan los valores por defecto
          console.warn('[AppConfig] No se pudo cargar assets/config.json. Usando configuración por defecto.');
          return of(this._config);
        })
      )
    );
  }
}

