import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

/** Respuesta del endpoint POST /api/login del Middle Server */
interface LoginResponse {
  token: string;
}

/** Credenciales enviadas al Middle Server */
interface LoginCredentials {
  username: string;
  password: string;
}

/** Credenciales de registro enviadas al Middle Server */
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

/**
 * Servicio de comunicación HTTP con el Middle Server para autenticación.
 * Responsabilidad única: llamadas REST de login/registro.
 * La gestión del estado de sesión corresponde a `AuthService`.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(AppConfigService);

  /**
   * Envía las credenciales al Middle Server y recibe el JWT de sesión.
   * @param username Nombre de usuario
   * @param password Contraseña del usuario
   * @returns Observable con el token JWT
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.configService.config.middleServerUrl}/api/login`;
    const body: LoginCredentials = { username, password };
    return this.http.post<LoginResponse>(url, body);
  }

  /**
   * Envía los datos de registro al Middle Server.
   * @param username Nombre de usuario deseado
   * @param email Correo electrónico
   * @param password Contraseña del usuario
   * @returns Observable con el token JWT de sesión
   */
  register(username: string, email: string, password: string): Observable<LoginResponse> {
    const url = `${this.configService.config.middleServerUrl}/api/register`;
    const body: RegisterCredentials = { username, email, password };
    return this.http.post<LoginResponse>(url, body);
  }
}
