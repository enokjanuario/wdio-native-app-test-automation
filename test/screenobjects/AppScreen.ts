import { SCREEN_DISPLAY_TIMEOUT, ELEMENT_WAIT_TIMEOUT } from '../config/timeouts.js';
import { Gestures } from '../helpers/gestures.js';

/**
 * Classe base para todos os screen objects.
 * Fornece helpers reutilizáveis de espera/ação para que as classes filhas fiquem enxutas.
 */
export abstract class AppScreen {
  protected abstract get screenSelector(): string;

  // -----------------------------------------------------------------------
  // Esperas em nível de tela
  // -----------------------------------------------------------------------
  async waitForScreenDisplayed(timeout: number = SCREEN_DISPLAY_TIMEOUT): Promise<void> {
    const element = await $(this.screenSelector);
    await element.waitForDisplayed({ timeout });
  }

  async isScreenDisplayed(): Promise<boolean> {
    const element = await $(this.screenSelector);
    return element.isDisplayed();
  }

  // -----------------------------------------------------------------------
  // Helpers de elemento — elimina padrões repetitivos de await-wait-act
  // -----------------------------------------------------------------------
  protected async waitAndClick(
    element: Promise<WebdriverIO.Element> | WebdriverIO.Element,
    timeout: number = ELEMENT_WAIT_TIMEOUT,
  ): Promise<void> {
    const el = await element;
    await el.waitForDisplayed({ timeout });
    await el.click();
  }

  protected async waitAndType(
    element: Promise<WebdriverIO.Element> | WebdriverIO.Element,
    text: string,
    timeout: number = ELEMENT_WAIT_TIMEOUT,
  ): Promise<void> {
    const el = await element;
    await el.waitForDisplayed({ timeout });
    await el.setValue(text);
  }

  protected async getTextFrom(
    element: Promise<WebdriverIO.Element> | WebdriverIO.Element,
    timeout: number = ELEMENT_WAIT_TIMEOUT,
  ): Promise<string> {
    const el = await element;
    await el.waitForDisplayed({ timeout });
    return el.getText();
  }

  protected async isElementVisible(
    element: Promise<WebdriverIO.Element> | WebdriverIO.Element,
    timeout = 3_000,
  ): Promise<boolean> {
    try {
      const el = await element;
      await el.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  // -----------------------------------------------------------------------
  // Helpers de scroll delegando para Gestures
  // -----------------------------------------------------------------------
  protected async scrollTo(
    selector: string,
    direction: 'up' | 'down' = 'down',
    maxScrolls?: number,
  ): Promise<void> {
    await Gestures.scrollToElement(selector, direction, maxScrolls);
  }
}
