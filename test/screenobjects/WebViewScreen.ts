import { AppScreen } from './AppScreen.js';
import { WEBVIEW_LOAD_TIMEOUT, WEBVIEW_INITIAL_DELAY } from '../config/timeouts.js';

class WebViewScreen extends AppScreen {
  protected get screenSelector(): string {
    if (driver.isAndroid) {
      return '//android.webkit.WebView';
    }
    return '-ios class chain:**/XCUIElementTypeWebView';
  }

  async waitForWebViewLoaded(timeout: number = WEBVIEW_LOAD_TIMEOUT): Promise<void> {
    // Motor de renderização do WebView precisa de uma breve inicialização antes do elemento ser consultável
    await driver.pause(WEBVIEW_INITIAL_DELAY);
    const webview = await $(this.screenSelector);
    await webview.waitForDisplayed({ timeout });
  }

  async switchToWebViewContext(): Promise<void> {
    await driver.pause(WEBVIEW_INITIAL_DELAY);
    const contexts = await driver.getContexts();
    const webViewContext = contexts.find(
      (ctx: string) => ctx.includes('WEBVIEW') || ctx.includes('webview'),
    );
    if (webViewContext) {
      await driver.switchContext(webViewContext as string);
    }
  }

  async switchToNativeContext(): Promise<void> {
    await driver.switchContext('NATIVE_APP');
  }

  async getPageTitle(): Promise<string> {
    return driver.getTitle();
  }

  async getUrl(): Promise<string> {
    return driver.getUrl();
  }
}

export const webViewScreen = new WebViewScreen();
