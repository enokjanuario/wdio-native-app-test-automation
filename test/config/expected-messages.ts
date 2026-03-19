/**
 * Mensagens esperadas da UI usadas nas asserções.
 *
 * Centralizar esses valores garante que:
 * 1. Uma mudança de texto no app requer apenas uma atualização aqui.
 * 2. Asserções validam texto exato em vez de verificações genéricas "não vazio".
 * 3. Revisores podem auditar o comportamento esperado sem ler cada spec.
 */

// ---------------------------------------------------------------------------
// Mensagens de erro de validação (telas de Login e Cadastro)
// ---------------------------------------------------------------------------
export const EMAIL_VALIDATION_ERROR = 'Please enter a valid email address';
export const PASSWORD_VALIDATION_ERROR = 'Please enter at least 8 characters';
export const CONFIRM_PASSWORD_MISMATCH_ERROR = 'Please enter the same password';

// ---------------------------------------------------------------------------
// Alertas de sucesso
// ---------------------------------------------------------------------------
export const LOGIN_SUCCESS_TITLE = 'Success';
export const LOGIN_SUCCESS_MESSAGE = 'You are logged in!';
export const SIGNUP_SUCCESS_TITLE = 'Signed Up!';
export const SIGNUP_SUCCESS_MESSAGE = 'You successfully signed up!';

// ---------------------------------------------------------------------------
// Tela de Formulários — Alerta do botão ativo
// ---------------------------------------------------------------------------
export const ACTIVE_BUTTON_ALERT_TITLE = 'This button is';
export const ACTIVE_BUTTON_ALERT_MESSAGE = 'This button is active';

// ---------------------------------------------------------------------------
// Tela de Arrastar
// ---------------------------------------------------------------------------
export const PUZZLE_COMPLETE_TEXT = 'Congratulations';
export const RETRY_BUTTON_TEXT = 'Retry';

// ---------------------------------------------------------------------------
// Tela de WebView
// ---------------------------------------------------------------------------
export const WEBVIEW_URL_PATTERN = 'webdriver';

// ---------------------------------------------------------------------------
// Tela de Swipe
// ---------------------------------------------------------------------------
export const WEBDRIVERIO_LOGO_LABEL = 'WebdriverIO logo';
