export class TabBar {
  private get homeTab(): Promise<WebdriverIO.Element> {
    return $('~Home');
  }

  private get webViewTab(): Promise<WebdriverIO.Element> {
    return $('~Webview');
  }

  private get loginTab(): Promise<WebdriverIO.Element> {
    return $('~Login');
  }

  private get formsTab(): Promise<WebdriverIO.Element> {
    return $('~Forms');
  }

  private get swipeTab(): Promise<WebdriverIO.Element> {
    return $('~Swipe');
  }

  private get dragTab(): Promise<WebdriverIO.Element> {
    return $('~Drag');
  }

  async openHome(): Promise<void> {
    const tab = await this.homeTab;
    await tab.click();
  }

  async openWebView(): Promise<void> {
    const tab = await this.webViewTab;
    await tab.click();
  }

  async openLogin(): Promise<void> {
    const tab = await this.loginTab;
    await tab.click();
  }

  async openForms(): Promise<void> {
    const tab = await this.formsTab;
    await tab.click();
  }

  async openSwipe(): Promise<void> {
    const tab = await this.swipeTab;
    await tab.click();
  }

  async openDrag(): Promise<void> {
    const tab = await this.dragTab;
    await tab.click();
  }

  async waitForTabBarDisplayed(): Promise<void> {
    const tab = await this.homeTab;
    await tab.waitForDisplayed({ timeout: 15000 });
  }
}

export const tabBar = new TabBar();
