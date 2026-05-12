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

  /**
   * Obtiene el perfil del usuario autenticado desde el Middle Server.
   */
  getProfile(): Observable<{ email: string; username: string; avatarUrl: string }> {
    const url = `${this.configService.config.middleServerUrl}/api/profile`;
    return this.http.get<{ email: string; username: string; avatarUrl: string }>(url);
  }

  /**
   * Actualiza el correo electrónico del usuario.
   */
  updateEmail(email: string): Observable<void> {
    const url = `${this.configService.config.middleServerUrl}/api/profile/email`;
    return this.http.put<void>(url, { email });
  }

  /**
   * Cambia la contraseña del usuario.
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const url = `${this.configService.config.middleServerUrl}/api/profile/password`;
    return this.http.put<void>(url, { currentPassword, newPassword });
  }

  /**
   * Sube una nueva imagen de avatar al servidor.
   * @param file Archivo de imagen (JPEG, PNG, WebP)
   * @returns Observable con la nueva URL del avatar
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const url = `${this.configService.config.middleServerUrl}/api/avatar`;
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(url, formData);
  }

  /**
   * Actualiza la URL del avatar del usuario (para avatares predeterminados).
   * @param avatarUrl URL del avatar predefinido
   */
  updateAvatarUrl(avatarUrl: string): Observable<{ avatarUrl: string }> {
    const url = `${this.configService.config.middleServerUrl}/api/avatar/url`;
    return this.http.put<{ avatarUrl: string }>(url, { avatarUrl });
  }

  /**
   * Solicita una renovación del JWT actual (Silent Refresh).
   * @returns Observable con el nuevo token JWT
   */
  refreshToken(): Observable<LoginResponse> {
    const url = `${this.configService.config.middleServerUrl}/api/auth/refresh`;
    return this.http.post<LoginResponse>(url, {});
  }
}
