// Roles posibles según la arquitectura del proyecto
export type UserRole = 'USER' | 'ADMIN';

// Payload decodificado del JWT emitido por el Middle Server
export interface JwtPayload {
  sub: string;        // username del usuario
  role: UserRole;     // rol del usuario
  iat: number;        // issued at
  exp: number;        // expiration
}

// Estado de sesión que expone el servicio
export interface SessionState {
  username: string;
  role: UserRole;
  token: string;
}
