import { AppScreen } from './AppScreen.js';
import { Gestures } from '../helpers/gestures.js';
import { ELEMENT_WAIT_TIMEOUT } from '../config/timeouts.js';
import { WEBDRIVERIO_LOGO_LABEL } from '../config/expected-messages.js';

class SwipeScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Swipe-screen';
  }

  private get wdioLogo(): Promise<WebdriverIO.Element> {
    return $(`~${WEBDRIVERIO_LOGO_LABEL}`);
  }

  // -----------------------------------------------------------------------
  // Detecção de cards — retorna títulos de cards visíveis em maiúscula para comparação
  // -----------------------------------------------------------------------
  async getVisibleCardTexts(): Promise<string[]> {
    const texts: string[] = [];
    const allTexts = await $$('//android.widget.TextView');
    for (const el of allTexts) {
      try {
        if (await el.isDisplayed()) {
          const text = await el.getText();
          const isUpperTitle = text && text.length > 3 && text === text.toUpperCase() && /[A-Z]/.test(text);
          if (isUpperTitle) {
            texts.push(text);
          }
        }
      } catch { /* elemento obsoleto — card rolou para fora da tela */ }
    }
    return texts;
  }

  async getActiveCardTitle(): Promise<string> {
    const texts = await this.getVisibleCardTexts();
    return texts.join('|') || 'no-cards';
  }

  // -----------------------------------------------------------------------
  // Gestos — delegados ao helper Gestures (sem performActions inline)
  // -----------------------------------------------------------------------
  async swipeLeft(): Promise<void> {
    const cardCenterY = await this.getCardCenterY();
    if (cardCenterY !== null) {
      await Gestures.swipeHorizontalAtY('left', cardCenterY);
    }
  }

  async swipeRight(): Promise<void> {
    const cardCenterY = await this.getCardCenterY();
    if (cardCenterY !== null) {
      await Gestures.swipeHorizontalAtY('right', cardCenterY);
    }
  }

  async scrollDown(): Promise<void> {
    await Gestures.scrollBetween(350, 50);
  }

  // -----------------------------------------------------------------------
  // Detecção do logo (conteúdo oculto no final do scroll)
  // -----------------------------------------------------------------------
  async isEndOfSwipeTextVisible(): Promise<boolean> {
    return this.isElementVisible(this.wdioLogo);
  }

  async getFoundLogoText(): Promise<string> {
    await this.getTextFrom(this.wdioLogo, ELEMENT_WAIT_TIMEOUT);
    return WEBDRIVERIO_LOGO_LABEL;
  }

  // -----------------------------------------------------------------------
  // Helpers privados
  // -----------------------------------------------------------------------
  private async getCardCenterY(): Promise<number | null> {
    const cards = await $$('~card');
    if (cards.length === 0) return null;
    const location = await cards[0].getLocation();
    const size = await cards[0].getSize();
    return location.y + size.height / 2;
  }
}

export const swipeScreen = new SwipeScreen();
