import { GESTURE, MAX_SCROLL_ATTEMPTS } from '../config/constants.js';

/**
 * Helpers de gestos centralizados usando a W3C Actions API.
 * Screen objects devem delegar TODAS as interações touch aqui — sem performActions inline.
 */
export class Gestures {
  // -----------------------------------------------------------------------
  // Swipe horizontal
  // -----------------------------------------------------------------------
  static async swipeHorizontal(
    direction: 'left' | 'right',
    percentage = 0.5,
  ): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const centerY = height / 2;
    const startX = direction === 'left' ? width * GESTURE.swipeStartX : width * GESTURE.swipeEndX;
    const endX = direction === 'left'
      ? width * (GESTURE.swipeStartX - percentage * GESTURE.swipePercentage)
      : width * (GESTURE.swipeEndX + percentage * GESTURE.swipePercentage);

    await Gestures.performSwipe(
      Math.round(startX), Math.round(centerY),
      Math.round(endX), Math.round(centerY),
    );
  }

  // -----------------------------------------------------------------------
  // Swipe horizontal em coordenada Y específica (ex: cards do carrossel)
  // -----------------------------------------------------------------------
  static async swipeHorizontalAtY(
    direction: 'left' | 'right',
    y: number,
  ): Promise<void> {
    const { width } = await driver.getWindowSize();
    const startX = direction === 'left' ? width * GESTURE.swipeStartX : width * GESTURE.swipeEndX;
    const endX = direction === 'left' ? width * GESTURE.swipeEndX : width * GESTURE.swipeStartX;

    await Gestures.performSwipe(
      Math.round(startX), Math.round(y),
      Math.round(endX), Math.round(y),
    );
  }

  // -----------------------------------------------------------------------
  // Swipe vertical (scroll)
  // -----------------------------------------------------------------------
  static async swipeVertical(
    direction: 'up' | 'down',
    percentage = 0.5,
  ): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const centerX = width / 2;
    const startY = direction === 'down' ? height * 0.3 : height * 0.7;
    const endY = direction === 'down'
      ? height * (0.3 + percentage * 0.4)
      : height * (0.7 - percentage * 0.4);

    await Gestures.performSwipe(
      Math.round(centerX), Math.round(startY),
      Math.round(centerX), Math.round(endY),
    );
  }

  // -----------------------------------------------------------------------
  // Scroll vertical entre coordenadas Y explícitas
  // -----------------------------------------------------------------------
  static async scrollBetween(
    startY: number,
    endY: number,
  ): Promise<void> {
    const { width } = await driver.getWindowSize();
    await Gestures.performSwipe(
      Math.round(width / 2), startY,
      Math.round(width / 2), endY,
      GESTURE.scrollMoveDuration,
    );
  }

  // -----------------------------------------------------------------------
  // Arrastar e soltar entre dois elementos
  // -----------------------------------------------------------------------
  static async dragAndDrop(
    source: WebdriverIO.Element,
    target: WebdriverIO.Element,
  ): Promise<void> {
    const sourceLocation = await source.getLocation();
    const sourceSize = await source.getSize();
    const targetLocation = await target.getLocation();
    const targetSize = await target.getSize();

    const startX = Math.round(sourceLocation.x + sourceSize.width / 2);
    const startY = Math.round(sourceLocation.y + sourceSize.height / 2);
    const endX = Math.round(targetLocation.x + targetSize.width / 2);
    const endY = Math.round(targetLocation.y + targetSize.height / 2);

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: GESTURE.dragHoldDuration },
        { type: 'pointerMove', duration: GESTURE.dragMoveDuration, x: endX, y: endY },
        { type: 'pause', duration: GESTURE.dragReleaseDuration },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
  }

  // -----------------------------------------------------------------------
  // Scroll até que um elemento correspondente ao `selector` fique visível
  // -----------------------------------------------------------------------
  static async scrollToElement(
    selector: string,
    direction: 'up' | 'down' = 'down',
    maxScrolls: number = MAX_SCROLL_ATTEMPTS,
  ): Promise<void> {
    for (let i = 0; i < maxScrolls; i++) {
      const element = await $(selector);
      if (await element.isDisplayed()) {
        return;
      }
      await Gestures.swipeVertical(direction === 'down' ? 'up' : 'down', 0.3);
    }
  }

  // -----------------------------------------------------------------------
  // Toque em um elemento após esperar que esteja visível
  // -----------------------------------------------------------------------
  static async tap(
    element: WebdriverIO.Element,
    timeout = 10_000,
  ): Promise<void> {
    await element.waitForDisplayed({ timeout });
    await element.click();
  }

  // -----------------------------------------------------------------------
  // Primitiva de swipe de baixo nível usada por todos os métodos públicos
  // -----------------------------------------------------------------------
  private static async performSwipe(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    moveDuration: number = GESTURE.swipeMoveDuration,
  ): Promise<void> {
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: GESTURE.pauseDuration },
        { type: 'pointerMove', duration: moveDuration, x: endX, y: endY },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
  }
}
