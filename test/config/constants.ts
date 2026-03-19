/**
 * Constantes globais da aplicação que evitam magic values espalhados pelo código.
 */
import * as path from 'path';

// ---------------------------------------------------------------------------
// Binários do app
// ---------------------------------------------------------------------------
export const APP_PATHS = {
  android: path.resolve('./apps/android.wdio.native.app.v2.0.0.apk'),
  ios: path.resolve('./apps/ios.wdio.native.app.v2.0.0.app'),
} as const;

// ---------------------------------------------------------------------------
// Dispositivos padrão (sobrescrevíveis via variáveis de ambiente)
// ---------------------------------------------------------------------------
export const DEVICE_DEFAULTS = {
  android: {
    deviceName: 'Pixel_7_API_34',
  },
  ios: {
    deviceName: 'iPhone 15',
    platformVersion: '17.4',
  },
} as const;

// ---------------------------------------------------------------------------
// Appium / infraestrutura
// ---------------------------------------------------------------------------
export const APPIUM_PORT = 4723;
export const BROWSERSTACK_HOSTNAME = 'hub.browserstack.com';

// ---------------------------------------------------------------------------
// IDs das peças do puzzle de arrastar e soltar (Tela de Drag)
// ---------------------------------------------------------------------------
export const PUZZLE_PIECE_IDS = [
  'drag-l1', 'drag-c1', 'drag-r1',
  'drag-l2', 'drag-c2', 'drag-r2',
  'drag-l3', 'drag-c3', 'drag-r3',
] as const;

export const PUZZLE_DROP_IDS = [
  'drop-l1', 'drop-c1', 'drop-r1',
  'drop-l2', 'drop-c2', 'drop-r2',
  'drop-l3', 'drop-c3', 'drop-r3',
] as const;

// ---------------------------------------------------------------------------
// Ajuste de gestos
// ---------------------------------------------------------------------------
export const GESTURE = {
  /** Fração da tela onde o swipe começa (próximo à borda) */
  swipeStartX: 0.8,
  /** Fração da tela onde o swipe termina */
  swipeEndX: 0.2,
  /** Multiplicador aplicado ao delta swipeStartX → swipeEndX */
  swipePercentage: 0.6,
  /** Tempo de hold do pointer antes de mover (ms) */
  pauseDuration: 100,
  /** Duração do movimento de swipe/slide (ms) */
  swipeMoveDuration: 300,
  /** Hold mais longo para arrastar e soltar (ms) */
  dragHoldDuration: 600,
  /** Duração do movimento de arrastar (ms) */
  dragMoveDuration: 800,
  /** Pausa breve antes do pointer-up (ms) */
  dragReleaseDuration: 200,
  /** Scroll vertical — movimento mais longo para confiabilidade (ms) */
  scrollMoveDuration: 500,
} as const;

// ---------------------------------------------------------------------------
// Limites de scroll
// ---------------------------------------------------------------------------
export const MAX_SCROLL_ATTEMPTS = 10;
