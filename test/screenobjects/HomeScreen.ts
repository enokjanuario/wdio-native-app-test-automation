import { AppScreen } from './AppScreen.js';

class HomeScreen extends AppScreen {
  protected get screenSelector(): string {
    return '~Home-screen';
  }

  private get logo(): Promise<WebdriverIO.Element> {
    return $('~Home-screen');
  }

  async isLogoDisplayed(): Promise<boolean> {
    const logo = await this.logo;
    return logo.isDisplayed();
  }
}

export const homeScreen = new HomeScreen();
