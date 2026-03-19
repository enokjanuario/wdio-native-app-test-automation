import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { webViewScreen } from '../../screenobjects/WebViewScreen.js';

describe('Tela de WebView @regression', () => {
  beforeEach(async () => {
    await tabBar.openWebView();
  });

  it('deve carregar a WebView e alternar para o contexto web com sucesso @smoke', async () => {
    await webViewScreen.waitForWebViewLoaded();
    await webViewScreen.switchToWebViewContext();

    const title = await webViewScreen.getPageTitle();
    expect(title).to.not.be.empty;

    await webViewScreen.switchToNativeContext();
  });

  it('deve exibir o conteúdo do site WebDriverIO na WebView @regression', async () => {
    await webViewScreen.waitForWebViewLoaded();
    await webViewScreen.switchToWebViewContext();

    const url = await webViewScreen.getUrl();
    expect(url).to.include('webdriver');

    await webViewScreen.switchToNativeContext();
  });

  it('deve retornar ao contexto nativo a partir da WebView @regression', async () => {
    await webViewScreen.waitForWebViewLoaded();
    await webViewScreen.switchToWebViewContext();
    await webViewScreen.switchToNativeContext();

    await tabBar.waitForTabBarDisplayed();
    await tabBar.openHome();
  });
});
