# Guía de contribución

Gracias por colaborar en el frontend de Viking Clan Wars.

Este repositorio contiene la capa de experiencia de usuario del juego: autenticación, selección de clan, lobby, partidas, estadísticas y vistas administrativas.

## 1. Objetivo del repositorio

La aplicación Angular conecta con el Middle Server y consume la API HTTP y eventos Socket.IO del juego. Su responsabilidad principal es ofrecer una experiencia fluida y coherente para los jugadores.

## 2. Requisitos

- Node.js 22
- npm
- Angular CLI (se instala con dependencias del proyecto)

## 3. Inicio rápido

```bash
npm install
npm start
```

Para compilar de producción:

```bash
npm run build
```

## 4. Reglas de desarrollo

- Mantén la lógica de negocio fuera de componentes cuando sea reutilizable.
- Usa servicios y modelos claros para la comunicación con el backend.
- Revisa el impacto de los cambios en rutas, estados de juego y sockets.
- No publiques secretos, configuraciones de producción ni tokens de sesión.
- Si cambias la estructura de la app, revisa también la documentación y la configuración del proyecto.

## 5. Estructura útil

- `src/app/core`: autenticación, servicios, estado global y lógica compartida
- `src/app/pages`: pantallas y flujos de usuario
- `src/app/shared`: componentes reutilizables
- `public`: assets, avisos, manifiesto y avatares

## 6. Convenciones de cambio

Usa nombres de rama descriptivos:

- `feature/lobby-improvements`
- `fix/auth-token-refresh`
- `refactor/socket-state-management`
- `docs/readme-update`

## 7. Convenciones de commits

Ejemplos:

- `feat: add clan selection screen`
- `fix: correct middle server URL config`
- `refactor: split socket handlers by feature`
- `docs: update frontend getting started guide`

## 8. Pull requests

Antes de abrir un PR:

- prueba `npm run build`
- usa `npm test` si has tocado componentes o servicios
- revisa que los flujos clave siguen funcionando con el middle server
- explica claramente qué cambia y cómo se valida

## 9. Integración con el proyecto

Este frontend depende del middle server y del DB server. Si un cambio altera:

- rutas de la API
- autenticación
- sockets
- estado de partidas

entonces también debes comprobar la compatibilidad con los otros repos del ecosistema.

## 10. Coordenación con otros repos

- [Orquestador](https://github.com/agb4455/tfm)
- [Middle Server](https://github.com/agb4455/ProyectoIntermodularDamServidorIntermedio)
- [DB Server](https://github.com/agb4455/ProyectoIntermodularDamBackend)

Gracias por ayudarte a que la experiencia del juego sea mejor y más coherente.
