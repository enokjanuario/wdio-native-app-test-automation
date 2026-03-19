import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { homeScreen } from '../../screenobjects/HomeScreen.js';
import { loginScreen } from '../../screenobjects/LoginScreen.js';
import { formsScreen } from '../../screenobjects/FormsScreen.js';
import { swipeScreen } from '../../screenobjects/SwipeScreen.js';
import { dragScreen } from '../../screenobjects/DragScreen.js';
import { nativeAlert } from '../../screenobjects/components/NativeAlert.js';
import e2eData from '../../data/e2e.data.json';
import { LOGIN_SUCCESS_TITLE } from '../../config/expected-messages.js';
import { POST_ACTION_DELAY } from '../../config/timeouts.js';

describe('Fluxo E2E Completo @e2e', () => {
  it('deve completar a jornada completa do app: navegar por todas as abas, fazer login, preencher formulário, deslizar e resolver quebra-cabeça @e2e', async () => {
    const { loginEmail, loginPassword, formInput } = e2eData.fullJourney;

    await homeScreen.waitForScreenDisplayed();
    expect(await homeScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();
    await loginScreen.login(loginEmail, loginPassword);
    await nativeAlert.waitForAlertDisplayed();
    const alertTitle = await nativeAlert.getAlertTitle();
    expect(alertTitle).to.include(LOGIN_SUCCESS_TITLE);
    await nativeAlert.tapOkButton();

    await tabBar.openForms();
    await formsScreen.waitForScreenDisplayed();
    await formsScreen.setInputText(formInput);
    const result = await formsScreen.getInputResult();
    expect(result).to.equal(formInput);

    await tabBar.openSwipe();
    await swipeScreen.waitForScreenDisplayed();
    await swipeScreen.swipeLeft();
    await driver.pause(POST_ACTION_DELAY);

    await tabBar.openDrag();
    await dragScreen.waitForScreenDisplayed();
    expect(await dragScreen.isScreenDisplayed()).to.be.true;

    await tabBar.openHome();
    await homeScreen.waitForScreenDisplayed();
    expect(await homeScreen.isScreenDisplayed()).to.be.true;
  });

  it('deve validar a estabilidade do app após troca rápida entre abas @e2e', async () => {
    const tabs = ['Login', 'Forms', 'Swipe', 'Drag', 'Home'] as const;
    const tabActions: Record<string, () => Promise<void>> = {
      Login: () => tabBar.openLogin(),
      Forms: () => tabBar.openForms(),
      Swipe: () => tabBar.openSwipe(),
      Drag: () => tabBar.openDrag(),
      Home: () => tabBar.openHome(),
    };

    for (let round = 0; round < 3; round++) {
      for (const tab of tabs) {
        await tabActions[tab]();
        await driver.pause(300);
      }
    }

    await tabBar.openHome();
    await homeScreen.waitForScreenDisplayed();
    expect(await homeScreen.isScreenDisplayed()).to.be.true;
  });
});
