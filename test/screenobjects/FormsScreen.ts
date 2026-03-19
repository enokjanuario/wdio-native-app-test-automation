import { AppScreen } from './AppScreen.js';
import { Gestures } from '../helpers/gestures.js';
import { platformSelect } from '../helpers/utils.js';
import { DROPDOWN_OPTION_TIMEOUT, POST_ACTION_DELAY } from '../config/timeouts.js';

class FormsScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Forms-screen';
  }

  private get textInput(): Promise<WebdriverIO.Element> {
    return $('~text-input');
  }

  private get inputResult(): Promise<WebdriverIO.Element> {
    return $('~input-text-result');
  }

  private get switchElement(): Promise<WebdriverIO.Element> {
    return $('~switch');
  }

  private get switchText(): Promise<WebdriverIO.Element> {
    return $('~switch-text');
  }

  private get dropdown(): Promise<WebdriverIO.Element> {
    return $('~Dropdown');
  }

  private get activeButton(): Promise<WebdriverIO.Element> {
    return $('~button-Active');
  }

  private get inactiveButton(): Promise<WebdriverIO.Element> {
    return $('~button-Inactive');
  }

  // -----------------------------------------------------------------------
  // Entrada de texto
  // -----------------------------------------------------------------------
  async setInputText(text: string): Promise<void> {
    await this.waitAndType(this.textInput, text);
  }

  async getInputResult(): Promise<string> {
    return this.getTextFrom(this.inputResult);
  }

  async clearInputText(): Promise<void> {
    const input = await this.textInput;
    await input.clearValue();
  }

  // -----------------------------------------------------------------------
  // Switch
  // -----------------------------------------------------------------------
  async tapSwitch(): Promise<void> {
    await this.waitAndClick(this.switchElement);
  }

  async isSwitchOn(): Promise<boolean> {
    const value = await this.getTextFrom(this.switchText);
    return value.includes('ON');
  }

  // -----------------------------------------------------------------------
  // Dropdown
  // -----------------------------------------------------------------------
  async selectDropdownOption(option: string): Promise<void> {
    await this.waitAndClick(this.dropdown);

    const optionSelector = platformSelect(
      `android=new UiSelector().text("${option}")`,
      `-ios predicate string:name == "${option}"`,
    );
    const optionElement = await $(optionSelector);
    await optionElement.waitForDisplayed({ timeout: DROPDOWN_OPTION_TIMEOUT });
    await optionElement.click();
  }

  async getDropdownSelectedValue(): Promise<string> {
    if (driver.isAndroid) {
      const selected = await $('android=new UiSelector().resourceId("text_input")');
      return selected.getText();
    }
    return this.getTextFrom(this.dropdown);
  }

  // -----------------------------------------------------------------------
  // Botões — scroll para visualizar via Gestures, depois clicar
  // -----------------------------------------------------------------------
  async tapActiveButton(): Promise<void> {
    await Gestures.swipeVertical('up', 0.4);
    await driver.pause(POST_ACTION_DELAY);
    await this.waitAndClick(this.activeButton);
  }

  async tapInactiveButton(): Promise<void> {
    await this.waitAndClick(this.inactiveButton);
  }
}

export const formsScreen = new FormsScreen();
