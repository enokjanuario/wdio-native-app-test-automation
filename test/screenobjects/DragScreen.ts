import { AppScreen } from './AppScreen.js';
import { Gestures } from '../helpers/gestures.js';
import { PUZZLE_PIECE_IDS } from '../config/constants.js';
import { ELEMENT_WAIT_TIMEOUT, POST_ACTION_DELAY } from '../config/timeouts.js';
import { PUZZLE_COMPLETE_TEXT } from '../config/expected-messages.js';

class DragScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Drag-drop-screen';
  }

  private get renewButton(): Promise<WebdriverIO.Element> {
    return $('~renew');
  }

  private async getDragElement(id: string): Promise<WebdriverIO.Element> {
    return $(`~${id}`);
  }

  private async getDropElement(id: string): Promise<WebdriverIO.Element> {
    const dropId = id.replace('drag-', 'drop-');
    return $(`~${dropId}`);
  }

  async dragPieceToTarget(pieceIndex: number): Promise<void> {
    const pieceId = PUZZLE_PIECE_IDS[pieceIndex];
    const source = await this.getDragElement(pieceId);
    const target = await this.getDropElement(pieceId);
    await Gestures.dragAndDrop(source, target);
  }

  async solvePuzzle(): Promise<void> {
    for (const pieceId of PUZZLE_PIECE_IDS) {
      const source = await this.getDragElement(pieceId);
      if (await source.isDisplayed()) {
        const target = await this.getDropElement(pieceId);
        await Gestures.dragAndDrop(source, target);
        await driver.pause(POST_ACTION_DELAY);
      }
    }
  }

  async isRetryButtonDisplayed(): Promise<boolean> {
    return this.isElementVisible($('~button-Retry'));
  }

  async isPuzzleSolved(): Promise<boolean> {
    return this.isElementVisible($(`//*[contains(@text,"${PUZZLE_COMPLETE_TEXT}")]`));
  }

  async getCongratulationsText(): Promise<string> {
    const text = await $(`//*[contains(@text,"${PUZZLE_COMPLETE_TEXT}")]`);
    await text.waitForDisplayed({ timeout: ELEMENT_WAIT_TIMEOUT });
    return text.getText();
  }

  async tapRenewButton(): Promise<void> {
    await this.waitAndClick(this.renewButton);
  }
}

export const dragScreen = new DragScreen();
