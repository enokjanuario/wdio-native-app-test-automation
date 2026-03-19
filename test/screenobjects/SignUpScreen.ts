import { AppScreen } from './AppScreen.js';
import { ERROR_MESSAGE_TIMEOUT } from '../config/timeouts.js';

class SignUpScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Login-screen';
  }

  private get emailInput(): Promise<WebdriverIO.Element> {
    return $('~input-email');
  }

  private get passwordInput(): Promise<WebdriverIO.Element> {
    return $('~input-password');
  }

  private get confirmPasswordInput(): Promise<WebdriverIO.Element> {
    return $('~input-repeat-password');
  }

  private get signUpButton(): Promise<WebdriverIO.Element> {
    return $('~button-SIGN UP');
  }

  private get signUpTabButton(): Promise<WebdriverIO.Element> {
    return $('~button-sign-up-container');
  }

  async setEmail(email: string): Promise<void> {
    await this.waitAndType(this.emailInput, email);
  }

  async setPassword(password: string): Promise<void> {
    await this.waitAndType(this.passwordInput, password);
  }

  async setConfirmPassword(password: string): Promise<void> {
    await this.waitAndType(this.confirmPasswordInput, password);
  }

  async tapSignUpButton(): Promise<void> {
    await this.waitAndClick(this.signUpButton);
  }

  async signUp(email: string, password: string): Promise<void> {
    await this.waitAndClick(this.signUpTabButton);
    await this.setEmail(email);
    await this.setPassword(password);
    await this.setConfirmPassword(password);
    await this.tapSignUpButton();
  }

  async getEmailErrorMessage(): Promise<string> {
    const el = await $('//*[contains(@text,"Please enter a valid")]');
    try {
      await el.waitForDisplayed({ timeout: ERROR_MESSAGE_TIMEOUT });
      return el.getText();
    } catch {
      return '';
    }
  }

  async getPasswordErrorMessage(): Promise<string> {
    const el = await $('//*[contains(@text,"Please enter at least 8")]');
    try {
      await el.waitForDisplayed({ timeout: ERROR_MESSAGE_TIMEOUT });
      return el.getText();
    } catch {
      return '';
    }
  }

  async getConfirmPasswordErrorMessage(): Promise<string> {
    const el = await $('//*[contains(@text,"Please enter the same password")]');
    try {
      await el.waitForDisplayed({ timeout: ERROR_MESSAGE_TIMEOUT });
      return el.getText();
    } catch {
      return '';
    }
  }
}

export const signUpScreen = new SignUpScreen();
