#!/usr/bin/env node
/**
 * Script de validación PWA para Viking Clan Wars.
 * Verifica que todos los archivos, configuraciones y referencias PWA sean correctos.
 * 
 * Ejecutar: node pwa-validation.js
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const FRONT_DIR = '.';
let passed = 0;
let failed = 0;
const errors = [];

function check(description, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.log(`  ❌ ${description}${detail ? ' — ' + detail : ''}`);
    failed++;
    errors.push(description);
  }
}

function fileExists(relativePath) {
  return existsSync(join(FRONT_DIR, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(FRONT_DIR, relativePath), 'utf-8'));
}

function readText(relativePath) {
  return readFileSync(join(FRONT_DIR, relativePath), 'utf-8');
}

console.log('\n🔍 VALIDACIÓN PWA — Viking Clan Wars\n');

// ═══════════════════════════════════════════════════════════════
// 1. ARCHIVOS EXISTENTES
// ═══════════════════════════════════════════════════════════════
console.log('📁 1. Archivos necesarios:');
check('manifest.webmanifest existe', fileExists('public/manifest.webmanifest'));
check('ngsw-config.json existe', fileExists('ngsw-config.json'));
check('.npmrc existe', fileExists('.npmrc'));

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of iconSizes) {
  const path = `public/icons/icon-${size}x${size}.png`;
  const exists = fileExists(path);
  if (exists) {
    const stat = statSync(join(FRONT_DIR, path));
    check(`icon-${size}x${size}.png (${(stat.size / 1024).toFixed(1)} KB)`, stat.size > 500,
      stat.size <= 500 ? 'archivo demasiado pequeño, puede estar corrupto' : '');
  } else {
    check(`icon-${size}x${size}.png`, false, 'archivo no encontrado');
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. MANIFEST WEBMANIFEST
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 2. Manifest (manifest.webmanifest):');
try {
  const manifest = readJson('public/manifest.webmanifest');
  check('name no es placeholder', manifest.name !== 'ProyectoIntermodularDamFrontend' && manifest.name?.length > 0,
    `name actual: "${manifest.name}"`);
  check('short_name definido', manifest.short_name?.length > 0 && manifest.short_name.length <= 12,
    `short_name: "${manifest.short_name}" (max 12 chars)`);
  check('display es "standalone"', manifest.display === 'standalone',
    `display: "${manifest.display}"`);
  check('theme_color definido', manifest.theme_color?.startsWith('#'),
    `theme_color: "${manifest.theme_color}"`);
  check('background_color definido', manifest.background_color?.startsWith('#'),
    `background_color: "${manifest.background_color}"`);
  check('start_url definido', manifest.start_url === '/' || manifest.start_url === './',
    `start_url: "${manifest.start_url}"`);
  check(`icons tiene ${iconSizes.length} entradas`, manifest.icons?.length === iconSizes.length,
    `encontrados: ${manifest.icons?.length}`);
  
  // Verificar que todos los iconos del manifest apuntan a archivos reales
  for (const icon of manifest.icons || []) {
    check(`icon ${icon.sizes} referencia archivo válido`, fileExists(`public/${icon.src}`),
      `ruta: ${icon.src}`);
  }
} catch (e) {
  check('manifest.webmanifest es JSON válido', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 3. NGSW-CONFIG.JSON (Service Worker)
// ═══════════════════════════════════════════════════════════════
console.log('\n⚙️  3. Service Worker (ngsw-config.json):');
try {
  const ngsw = readJson('ngsw-config.json');
  check('index apunta a /index.html', ngsw.index === '/index.html');
  check('assetGroups tiene "app" group', ngsw.assetGroups?.some(g => g.name === 'app'));
  check('assetGroups tiene "assets" group', ngsw.assetGroups?.some(g => g.name === 'assets'));
  
  const appGroup = ngsw.assetGroups?.find(g => g.name === 'app');
  check('"app" usa prefetch', appGroup?.installMode === 'prefetch');
  check('"app" incluye /*.js', appGroup?.resources?.files?.includes('/*.js'));
  check('"app" incluye /*.css', appGroup?.resources?.files?.includes('/*.css'));
  check('"app" NO referencia favicon.ico', !appGroup?.resources?.files?.includes('/favicon.ico'),
    'el proyecto usa favicon.svg, no .ico');
  
  const assetsGroup = ngsw.assetGroups?.find(g => g.name === 'assets');
  check('"assets" usa lazy', assetsGroup?.installMode === 'lazy');
  
  // Verificar que NO hay dataGroups (no queremos cachear APIs)
  check('sin dataGroups (APIs no cacheadas)', !ngsw.dataGroups || ngsw.dataGroups.length === 0,
    'las APIs WebSocket/REST no deben cachearse');
} catch (e) {
  check('ngsw-config.json es JSON válido', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 4. INDEX.HTML
// ═══════════════════════════════════════════════════════════════
console.log('\n🌐 4. index.html:');
try {
  const html = readText('src/index.html');
  
  // Manifest link
  const manifestLinks = (html.match(/rel="manifest"/g) || []).length;
  check('tiene <link rel="manifest">', manifestLinks >= 1);
  check('NO tiene manifest duplicado', manifestLinks === 1,
    `encontrados: ${manifestLinks} links de manifest`);
  
  // Theme color
  check('tiene <meta name="theme-color">', html.includes('name="theme-color"'));
  
  // iOS meta tags
  check('tiene apple-mobile-web-app-capable', html.includes('apple-mobile-web-app-capable'));
  check('tiene apple-mobile-web-app-title', html.includes('apple-mobile-web-app-title'));
  check('tiene apple-touch-icon', html.includes('apple-touch-icon'));
  
  // SEO
  check('tiene <meta name="description">', html.includes('name="description"'));
  
  // No debe haber noscript duplicado
  const noscriptCount = (html.match(/<noscript>/g) || []).length;
  check('un solo <noscript>', noscriptCount === 1, `encontrados: ${noscriptCount}`);
} catch (e) {
  check('index.html legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 5. APP.CONFIG.TS
// ═══════════════════════════════════════════════════════════════
console.log('\n🔧 5. app.config.ts:');
try {
  const config = readText('src/app/app.config.ts');
  
  check('importa provideServiceWorker', config.includes("from '@angular/service-worker'"));
  check('registra provideServiceWorker', config.includes('provideServiceWorker'));
  
  // No debe tener duplicados
  const swCount = (config.match(/provideServiceWorker\(/g) || []).length;
  check('NO tiene provideServiceWorker duplicado', swCount === 1,
    `encontrados: ${swCount} registros`);
  
  check('usa isDevMode() para enabled', config.includes('!isDevMode()'));
  check('usa registerWhenStable', config.includes('registerWhenStable'));
} catch (e) {
  check('app.config.ts legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 6. ANGULAR.JSON
// ═══════════════════════════════════════════════════════════════
console.log('\n📦 6. angular.json:');
try {
  const angular = readJson('angular.json');
  const project = angular.projects?.ProyectoIntermodularDamFrontend;
  const prodConfig = project?.architect?.build?.configurations?.production;
  const devConfig = project?.architect?.build?.configurations?.development;
  
  check('producción tiene serviceWorker', prodConfig?.serviceWorker === 'ngsw-config.json',
    `valor: "${prodConfig?.serviceWorker}"`);
  check('desarrollo NO tiene serviceWorker', !devConfig?.serviceWorker,
    'el SW no debe activarse en dev');
} catch (e) {
  check('angular.json legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 7. PACKAGE.JSON
// ═══════════════════════════════════════════════════════════════
console.log('\n📦 7. package.json:');
try {
  const pkg = readJson('package.json');
  const swVersion = pkg.dependencies?.['@angular/service-worker'];
  const coreVersion = pkg.dependencies?.['@angular/core'];
  
  check('@angular/service-worker en dependencies', !!swVersion, `versión: ${swVersion}`);
  check('versión compatible con @angular/core', 
    swVersion?.replace('^', '').split('.').slice(0, 2).join('.') === 
    coreVersion?.replace('^', '').split('.').slice(0, 2).join('.'),
    `SW: ${swVersion}, Core: ${coreVersion}`);
} catch (e) {
  check('package.json legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 8. .NPMRC
// ═══════════════════════════════════════════════════════════════
console.log('\n📄 8. .npmrc:');
try {
  const npmrc = readText('.npmrc');
  check('contiene legacy-peer-deps=true', npmrc.includes('legacy-peer-deps=true'),
    'necesario para resolver conflictos de peer deps en Docker');
} catch (e) {
  check('.npmrc legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// 9. CONSISTENCIA DE COLORES
// ═══════════════════════════════════════════════════════════════
console.log('\n🎨 9. Consistencia de colores:');
try {
  const manifest = readJson('public/manifest.webmanifest');
  const html = readText('src/index.html');
  const tokens = readText('src/styles/tokens.scss');
  
  // Extraer --color-bg-primary del tema oscuro
  const bgPrimaryMatch = tokens.match(/--color-bg-primary:\s*(#[0-9a-fA-F]+)/);
  const bgPrimary = bgPrimaryMatch?.[1];
  
  check('theme_color coincide con --color-bg-primary', 
    manifest.theme_color === bgPrimary,
    `manifest: ${manifest.theme_color}, tokens: ${bgPrimary}`);
  check('background_color coincide con --color-bg-primary', 
    manifest.background_color === bgPrimary,
    `manifest: ${manifest.background_color}, tokens: ${bgPrimary}`);
  
  // Verificar que el theme-color en index.html coincide
  const htmlThemeMatch = html.match(/name="theme-color"\s+content="([^"]+)"/);
  check('theme-color en HTML coincide con manifest', 
    htmlThemeMatch?.[1] === manifest.theme_color,
    `HTML: ${htmlThemeMatch?.[1]}, Manifest: ${manifest.theme_color}`);
} catch (e) {
  check('tokens.scss legible', false, e.message);
}

// ═══════════════════════════════════════════════════════════════
// RESUMEN
// ═══════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log(`📊 RESULTADO: ${passed} pasados, ${failed} fallidos`);
if (failed === 0) {
  console.log('🎉 ¡Todos los checks PWA pasaron correctamente!');
} else {
  console.log('⚠️  Errores encontrados:');
  errors.forEach(e => console.log(`   • ${e}`));
}
console.log('═'.repeat(60) + '\n');

process.exit(failed > 0 ? 1 : 0);
