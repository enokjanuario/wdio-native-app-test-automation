import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { swipeScreen } from '../../screenobjects/SwipeScreen.js';
import { WEBDRIVERIO_LOGO_LABEL } from '../../config/expected-messages.js';
import { POST_ACTION_DELAY } from '../../config/timeouts.js';

describe('Tela de Swipe @regression', () => {
  beforeEach(async () => {
    await tabBar.openSwipe();
    await swipeScreen.waitForScreenDisplayed();
  });

  it('deve deslizar para a esquerda no carrossel e verificar que o card mudou @smoke', async () => {
    const initialTitle = await swipeScreen.getActiveCardTitle();
    await swipeScreen.swipeLeft();
    await driver.pause(POST_ACTION_DELAY);

    const newTitle = await swipeScreen.getActiveCardTitle();
    expect(newTitle).to.not.equal(initialTitle);
  });

  it('deve deslizar para a direita no carrossel e voltar ao primeiro card @regression', async () => {
    await swipeScreen.swipeLeft();
    await driver.pause(POST_ACTION_DELAY);

    const afterLeftSwipe = await swipeScreen.getActiveCardTitle();
    await swipeScreen.swipeRight();
    await driver.pause(POST_ACTION_DELAY);

    const afterRightSwipe = await swipeScreen.getActiveCardTitle();
    expect(afterRightSwipe).to.not.equal(afterLeftSwipe);
  });

  it('deve rolar para baixo e encontrar conteúdo oculto @regression', async () => {
    for (let i = 0; i < 5; i++) {
      await swipeScreen.scrollDown();
      await driver.pause(300);

      const isVisible = await swipeScreen.isEndOfSwipeTextVisible();
      if (isVisible) break;
    }

    const isVisible = await swipeScreen.isEndOfSwipeTextVisible();
    expect(isVisible).to.be.true;
  });

  it('deve alcançar o final do conteúdo rolável @boundary', async () => {
    for (let i = 0; i < 8; i++) {
      await swipeScreen.scrollDown();
      await driver.pause(300);
    }

    const logoText = await swipeScreen.getFoundLogoText();
    expect(logoText).to.equal(WEBDRIVERIO_LOGO_LABEL);
  });
});
