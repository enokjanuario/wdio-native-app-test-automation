/**
 * Constantes de timeout centralizadas para a suite de testes.
 * Cada valor inclui uma justificativa para que mantenedores possam ajustar com confiança.
 */

/** Tempo para uma transição completa de tela em emuladores/dispositivos lentos */
export const SCREEN_DISPLAY_TIMEOUT = 15_000;

/** Alertas nativos do SO possuem animação — tempo extra para dispositivos antigos */
export const ALERT_DISPLAY_TIMEOUT = 10_000;

/** WebView carrega uma URL externa (webdriver.io) pela rede */
export const WEBVIEW_LOAD_TIMEOUT = 20_000;

/** Mensagens de validação aparecem após blur do campo — geralmente rápido */
export const ERROR_MESSAGE_TIMEOUT = 5_000;

/** Espera padrão para qualquer elemento genérico ficar visível */
export const ELEMENT_WAIT_TIMEOUT = 10_000;

/** Tempo de animação + renderização da lista de opções do dropdown */
export const DROPDOWN_OPTION_TIMEOUT = 5_000;

/** Motor de renderização do WebView precisa de tempo para inicializar antes da troca de contexto */
export const WEBVIEW_INITIAL_DELAY = 3_000;

/** Pausa breve após swipe/drag para a animação se estabilizar */
export const POST_ACTION_DELAY = 500;

/** newCommandTimeout do Appium — previne sessões zumbi no servidor */
export const APPIUM_COMMAND_TIMEOUT = 240;

/** Timeout por teste do Mocha incluindo todas as esperas e retries */
export const MOCHA_TEST_TIMEOUT = 60_000;

/** Janela de retry de conexão com o Appium antes de desistir */
export const CONNECTION_RETRY_TIMEOUT = 120_000;

/** Número de retries de conexão com o servidor Appium */
export const CONNECTION_RETRY_COUNT = 3;

/** waitforTimeout padrão usado pelas esperas implícitas do WDIO */
export const WDIO_WAITFOR_TIMEOUT = 10_000;
