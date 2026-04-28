/**
 * Interfaz que tipifica el fichero externo `assets/config.json`.
 * Añadir aquí cualquier propiedad de configuración de entorno futura.
 */
export interface AppConfig {
  /** URL base del Middle Server (Node.js + Express + Socket.IO) */
  middleServerUrl: string;
}
