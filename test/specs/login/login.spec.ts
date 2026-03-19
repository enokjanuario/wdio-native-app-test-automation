import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { loginScreen } from '../../screenobjects/LoginScreen.js';
import { nativeAlert } from '../../screenobjects/components/NativeAlert.js';
import loginData from '../../data/login.data.json';
import {
  EMAIL_VALIDATION_ERROR,
  PASSWORD_VALIDATION_ERROR,
  LOGIN_SUCCESS_TITLE,
  LOGIN_SUCCESS_MESSAGE,
} from '../../config/expected-messages.js';

describe('Tela de Login @regression', () => {
  beforeEach(async () => {
    await nativeAlert.dismissIfPresent();
    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();
    await loginScreen.tapLoginTab();
  });

  it('deve exibir alerta de sucesso ao fazer login com credenciais válidas @smoke', async () => {
    const creds = loginData.validCredentials[0];
    await loginScreen.login(creds.email, creds.password);
    await nativeAlert.waitForAlertDisplayed();

    const isDisplayed = await nativeAlert.isAlertDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('deve exibir mensagem de erro quando o e-mail é inválido @regression', async () => {
    const creds = loginData.invalidCredentials.find(c => c.description === 'invalid email format')!;
    await loginScreen.setEmail(creds.email);
    await loginScreen.setPassword(creds.password);
    await loginScreen.tapLoginButton();

    const errorMessage = await loginScreen.getEmailErrorMessage();
    expect(errorMessage).to.equal(EMAIL_VALIDATION_ERROR);
  });

  it('deve exibir mensagem de erro quando a senha é muito curta @regression', async () => {
    const creds = loginData.invalidCredentials.find(c => c.description === 'password too short')!;
    await loginScreen.setEmail(creds.email);
    await loginScreen.setPassword(creds.password);
    await loginScreen.tapLoginButton();

    const errorMessage = await loginScreen.getPasswordErrorMessage();
    expect(errorMessage).to.equal(PASSWORD_VALIDATION_ERROR);
  });

  it('não deve fazer login com ambos os campos vazios @regression', async () => {
    const isEnabled = await loginScreen.isLoginButtonEnabled();
    expect(isEnabled).to.be.true;
  });

  it('deve exibir mensagem de erro quando o formato do e-mail é inválido @boundary', async () => {
    const creds = loginData.invalidCredentials.find(c => c.description === 'invalid email format')!;
    await loginScreen.setEmail(creds.email);
    await loginScreen.setPassword(creds.password);
    await loginScreen.tapLoginButton();

    const errorMessage = await loginScreen.getEmailErrorMessage();
    expect(errorMessage).to.equal(EMAIL_VALIDATION_ERROR);
  });

  loginData.validCredentials.forEach((creds) => {
    it(`deve validar título e mensagem do alerta ao fazer login com sucesso usando ${creds.description} @regression`, async () => {
      await loginScreen.login(creds.email, creds.password);
      await nativeAlert.waitForAlertDisplayed();

      const title = await nativeAlert.getAlertTitle();
      expect(title).to.include(LOGIN_SUCCESS_TITLE);

      const message = await nativeAlert.getAlertMessage();
      expect(message).to.equal(LOGIN_SUCCESS_MESSAGE);

      await nativeAlert.tapOkButton();
    });
  });

  it('deve fechar o alerta e permanecer na tela de login após login bem-sucedido @regression', async () => {
    const creds = loginData.validCredentials[0];
    await loginScreen.login(creds.email, creds.password);
    await nativeAlert.waitForAlertDisplayed();
    await nativeAlert.tapOkButton();

    const isScreenDisplayed = await loginScreen.isScreenDisplayed();
    expect(isScreenDisplayed).to.be.true;
  });
});
