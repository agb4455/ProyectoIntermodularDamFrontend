// Roles posibles según la arquitectura del proyecto
export type UserRole = 'USER' | 'ADMIN';

/**
 * Payload decodificado del JWT emitido por el Middle Server.
 * El JWT identifica al usuario (sub, role). Los personajes y clanes
 * son estado de juego y se gestionan fuera de la sesión HTTP.
 */
export interface JwtPayload {
  sub: string;       // Nombre de usuario (campo estándar RFC 7519)
  role: UserRole;    // Rol del usuario
  iat: number;       // Issued at
  exp: number;       // Expiration
}

// Estado de sesión que expone el servicio
export interface SessionState {
  username: string;
  role: UserRole;
  token: string;
}

