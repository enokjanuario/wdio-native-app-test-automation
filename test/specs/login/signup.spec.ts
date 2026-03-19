import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { loginScreen } from '../../screenobjects/LoginScreen.js';
import { signUpScreen } from '../../screenobjects/SignUpScreen.js';
import { nativeAlert } from '../../screenobjects/components/NativeAlert.js';
import signUpData from '../../data/signup.data.json';
import {
  EMAIL_VALIDATION_ERROR,
  PASSWORD_VALIDATION_ERROR,
  CONFIRM_PASSWORD_MISMATCH_ERROR,
} from '../../config/expected-messages.js';

/** Map from expectedError key → exact message constant */
const ERROR_LOOKUP: Record<string, string> = {
  email: EMAIL_VALIDATION_ERROR,
  password: PASSWORD_VALIDATION_ERROR,
  confirmPassword: CONFIRM_PASSWORD_MISMATCH_ERROR,
};

describe('Tela de Cadastro @regression', () => {
  beforeEach(async () => {
    await nativeAlert.dismissIfPresent();
    await tabBar.openLogin();
    await loginScreen.waitForScreenDisplayed();
    await loginScreen.tapSignUpTab();
  });

  it('deve exibir alerta de sucesso ao cadastrar com dados válidos @smoke', async () => {
    const data = signUpData.validSignUp[0];
    await signUpScreen.setEmail(data.email);
    await signUpScreen.setPassword(data.password);
    await signUpScreen.setConfirmPassword(data.password);
    await signUpScreen.tapSignUpButton();

    await nativeAlert.waitForAlertDisplayed();
    const isDisplayed = await nativeAlert.isAlertDisplayed();
    expect(isDisplayed).to.be.true;

    await nativeAlert.tapOkButton();
  });

  it('deve exibir erro quando o e-mail é inválido no cadastro @regression', async () => {
    await signUpScreen.setEmail('invalidemail');
    await signUpScreen.setPassword('Test@1234');
    await signUpScreen.setConfirmPassword('Test@1234');
    await signUpScreen.tapSignUpButton();

    const error = await signUpScreen.getEmailErrorMessage();
    expect(error).to.equal(EMAIL_VALIDATION_ERROR);
  });

  it('deve exibir erro quando a senha é muito curta no cadastro @regression', async () => {
    const data = signUpData.invalidSignUp.find(d => d.description === 'password too short')!;
    await signUpScreen.setEmail(data.email);
    await signUpScreen.setPassword(data.password);
    await signUpScreen.setConfirmPassword(data.confirmPassword!);
    await signUpScreen.tapSignUpButton();

    const error = await signUpScreen.getPasswordErrorMessage();
    expect(error).to.equal(PASSWORD_VALIDATION_ERROR);
  });

  it('deve exibir erro quando a confirmação de senha não confere @regression', async () => {
    const data = signUpData.invalidSignUp.find(d => d.description === 'passwords do not match')!;
    await signUpScreen.setEmail(data.email);
    await signUpScreen.setPassword(data.password);
    await signUpScreen.setConfirmPassword(data.confirmPassword!);
    await signUpScreen.tapSignUpButton();

    const error = await signUpScreen.getConfirmPasswordErrorMessage();
    expect(error).to.equal(CONFIRM_PASSWORD_MISMATCH_ERROR);
  });

  it('deve exibir erro quando a senha é muito curta @boundary', async () => {
    const data = signUpData.invalidSignUp.find(d => d.description === 'password too short')!;
    await signUpScreen.setEmail(data.email);
    await signUpScreen.setPassword(data.password);
    await signUpScreen.setConfirmPassword(data.confirmPassword!);
    await signUpScreen.tapSignUpButton();

    const error = await signUpScreen.getPasswordErrorMessage();
    expect(error).to.equal(PASSWORD_VALIDATION_ERROR);
  });

  signUpData.invalidSignUp.filter(d => d.email && d.password).forEach((data) => {
    it(`deve validar cenário de erro no cadastro: ${data.description} @regression`, async () => {
      if (data.email) await signUpScreen.setEmail(data.email);
      if (data.password) await signUpScreen.setPassword(data.password);
      if (data.confirmPassword) await signUpScreen.setConfirmPassword(data.confirmPassword);
      await signUpScreen.tapSignUpButton();

      const expectedMessage = ERROR_LOOKUP[data.expectedError];
      if (data.expectedError === 'email') {
        const error = await signUpScreen.getEmailErrorMessage();
        expect(error).to.equal(expectedMessage);
      } else if (data.expectedError === 'password') {
        const error = await signUpScreen.getPasswordErrorMessage();
        expect(error).to.equal(expectedMessage);
      } else if (data.expectedError === 'confirmPassword') {
        const error = await signUpScreen.getConfirmPasswordErrorMessage();
        expect(error).to.equal(expectedMessage);
      }
    });
  });
});
