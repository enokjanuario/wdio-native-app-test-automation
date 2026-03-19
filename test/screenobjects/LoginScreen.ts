import { AppScreen } from './AppScreen.js';
import { ERROR_MESSAGE_TIMEOUT } from '../config/timeouts.js';

class LoginScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Login-screen';
  }

  private get loginTabButton(): Promise<WebdriverIO.Element> {
    return $('~button-login-container');
  }

  private get signUpTabButton(): Promise<WebdriverIO.Element> {
    return $('~button-sign-up-container');
  }

  private get emailInput(): Promise<WebdriverIO.Element> {
    return $('~input-email');
  }

  private get passwordInput(): Promise<WebdriverIO.Element> {
    return $('~input-password');
  }

  private get loginButton(): Promise<WebdriverIO.Element> {
    return $('~button-LOGIN');
  }

  async tapLoginTab(): Promise<void> {
    await this.waitAndClick(this.loginTabButton);
  }

  async tapSignUpTab(): Promise<void> {
    await this.waitAndClick(this.signUpTabButton);
  }

  async setEmail(email: string): Promise<void> {
    await this.waitAndType(this.emailInput, email);
  }

  async setPassword(password: string): Promise<void> {
    await this.waitAndType(this.passwordInput, password);
  }

  async tapLoginButton(): Promise<void> {
    await this.waitAndClick(this.loginButton);
  }

  async login(email: string, password: string): Promise<void> {
    await this.tapLoginTab();
    await this.setEmail(email);
    await this.setPassword(password);
    await this.tapLoginButton();
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

  async isLoginButtonEnabled(): Promise<boolean> {
    const button = await this.loginButton;
    return button.isEnabled();
  }
}

export const loginScreen = new LoginScreen();
