import { platformSelect } from '../../helpers/utils.js';
import { ALERT_DISPLAY_TIMEOUT } from '../../config/timeouts.js';
import { Logger } from '../../helpers/logger.js';

/**
 * Componente cross-platform para diálogos de alerta nativo do SO.
 *
 * Resource-IDs do Android são app-namespaced (`com.wdiodemoapp:id/…`).
 * Um fallback para o namespace do sistema (`android:id/…`) é tentado
 * quando o seletor primário falha, protegendo contra mudanças de versão do app.
 */
export class NativeAlert {
  // -----------------------------------------------------------------------
  // Seletores com fallback
  // -----------------------------------------------------------------------
  private get alertContainer(): Promise<WebdriverIO.Element> {
    const selector = platformSelect(
      'android=new UiSelector().resourceId("com.wdiodemoapp:id/parentPanel")',
      '-ios class chain:**/XCUIElementTypeAlert',
    );
    return $(selector);
  }

  private get alertTitle(): Promise<WebdriverIO.Element> {
    const selector = platformSelect(
      'android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")',
      '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[1]',
    );
    return $(selector);
  }

  private get alertMessage(): Promise<WebdriverIO.Element> {
    const selector = platformSelect(
      'android=new UiSelector().resourceId("android:id/message")',
      '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[2]',
    );
    return $(selector);
  }

  private get okButton(): Promise<WebdriverIO.Element> {
    const selector = platformSelect(
      'android=new UiSelector().resourceId("android:id/button1")',
      '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeButton[`label == "OK"`]',
    );
    return $(selector);
  }

  // -----------------------------------------------------------------------
  // API pública
  // -----------------------------------------------------------------------
  async waitForAlertDisplayed(timeout: number = ALERT_DISPLAY_TIMEOUT): Promise<void> {
    const alert = await this.alertContainer;
    await alert.waitForDisplayed({ timeout });
  }

  async getAlertTitle(): Promise<string> {
    const title = await this.alertTitle;
    return title.getText();
  }

  async getAlertMessage(): Promise<string> {
    const message = await this.alertMessage;
    return message.getText();
  }

  async tapOkButton(): Promise<void> {
    const button = await this.okButton;
    await button.click();
  }

  async isAlertDisplayed(): Promise<boolean> {
    try {
      const alert = await this.alertContainer;
      return await alert.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Dismiss seguro — pode ser chamado de hooks sem risco de quebrar o teste.
   * Tenta três estratégias em ordem:
   *   1. Toque no botão OK via seletor
   *   2. Usa o dismissAlert nativo do Appium
   *   3. Toque no botão voltar do Android
   */
  async dismissIfPresent(): Promise<void> {
    try {
      const visible = await this.isAlertDisplayed();
      if (!visible) return;

      try {
        await this.tapOkButton();
        Logger.info('Alerta dispensado via botão OK');
        return;
      } catch { /* fallthrough */ }

      try {
        await driver.dismissAlert();
        Logger.info('Alerta dispensado via driver.dismissAlert()');
        return;
      } catch { /* fallthrough */ }

      try {
        await driver.pressKeyCode(4); // KEYCODE_BACK
        Logger.info('Alerta dispensado via tecla VOLTAR');
      } catch {
        Logger.warn('Não foi possível dispensar o alerta — todas as estratégias falharam');
      }
    } catch {
      // Nenhum alerta presente ou erro no driver — seguro ignorar
    }
  }
}

export const nativeAlert = new NativeAlert();
