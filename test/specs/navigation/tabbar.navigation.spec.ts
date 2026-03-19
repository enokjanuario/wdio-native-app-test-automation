import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { homeScreen } from '../../screenobjects/HomeScreen.js';
import { loginScreen } from '../../screenobjects/LoginScreen.js';
import { formsScreen } from '../../screenobjects/FormsScreen.js';
import { swipeScreen } from '../../screenobjects/SwipeScreen.js';
import { dragScreen } from '../../screenobjects/DragScreen.js';

describe('Navegação pela Barra de Abas @smoke', () => {
  it('deve exibir a tela Home como padrão ao iniciar o app @smoke', async () => {
    await homeScreen.waitForScreenDisplayed();
    const isDisplayed = await homeScreen.isScreenDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('deve navegar por todas as abas e verificar que cada tela carrega corretamente @smoke', async () => {
    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();
    expect(await loginScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openForms();
    await formsScreen.waitForScreenDisplayed();
    expect(await formsScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openSwipe();
    await swipeScreen.waitForScreenDisplayed();
    expect(await swipeScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openDrag();
    await dragScreen.waitForScreenDisplayed();
    expect(await dragScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openHome();
    await homeScreen.waitForScreenDisplayed();
    expect(await homeScreen.isScreenDisplayed()).to.be.true;
  });

  it('deve manter o estado da aba ao navegar entre telas @regression', async () => {
    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();

    await tabBar.openForms();
    await formsScreen.waitForScreenDisplayed();

    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();
    expect(await loginScreen.isScreenDisplayed()).to.be.true;
  });

  it('deve destacar a aba ativa na barra de navegação @regression', async () => {
    await tabBar.openForms();
    await formsScreen.waitForScreenDisplayed();
    const isFormsDisplayed = await formsScreen.isScreenDisplayed();
    expect(isFormsDisplayed).to.be.true;

    await tabBar.openHome();
    await homeScreen.waitForScreenDisplayed();
    const isHomeDisplayed = await homeScreen.isScreenDisplayed();
    expect(isHomeDisplayed).to.be.true;
  });
});
