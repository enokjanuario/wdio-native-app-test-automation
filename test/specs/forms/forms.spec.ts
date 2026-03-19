import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { formsScreen } from '../../screenobjects/FormsScreen.js';
import { nativeAlert } from '../../screenobjects/components/NativeAlert.js';
import formsData from '../../data/forms.data.json';
import { ACTIVE_BUTTON_ALERT_TITLE } from '../../config/expected-messages.js';

describe('Tela de Formulários @regression', () => {
  beforeEach(async () => {
    await tabBar.openForms();
    await formsScreen.waitForScreenDisplayed();
  });

  it('deve espelhar o texto digitado no campo de resultado @smoke', async () => {
    const data = formsData.textInputs[0];
    await formsScreen.setInputText(data.input);

    const result = await formsScreen.getInputResult();
    expect(result).to.equal(data.input);
  });

  it('deve alternar o switch entre ligado e desligado @smoke', async () => {
    const initialState = await formsScreen.isSwitchOn();
    await formsScreen.tapSwitch();
    const newState = await formsScreen.isSwitchOn();
    expect(newState).to.not.equal(initialState);

    await formsScreen.tapSwitch();
    const restoredState = await formsScreen.isSwitchOn();
    expect(restoredState).to.equal(initialState);
  });

  formsData.dropdownOptions.forEach((data) => {
    it(`deve selecionar a opção "${data.description}" no dropdown e verificar o valor selecionado @regression`, async () => {
      await formsScreen.selectDropdownOption(data.option);
      await driver.pause(500);

      const selected = await formsScreen.getDropdownSelectedValue();
      expect(selected).to.include(data.option);
    });
  });

  it('deve exibir alerta nativo ao tocar no botão ativo @regression', async () => {
    await formsScreen.tapActiveButton();
    await nativeAlert.waitForAlertDisplayed();

    const isDisplayed = await nativeAlert.isAlertDisplayed();
    expect(isDisplayed).to.be.true;

    const title = await nativeAlert.getAlertTitle();
    expect(title).to.equal(ACTIVE_BUTTON_ALERT_TITLE);

    await nativeAlert.tapOkButton();
  });

  formsData.textInputs.forEach((data) => {
    it(`deve tratar entrada de texto: ${data.description} @boundary`, async () => {
      if (data.input) {
        await formsScreen.setInputText(data.input);
        const result = await formsScreen.getInputResult();
        expect(result).to.equal(data.input);
      }
    });
  });

  it('deve limpar o campo de entrada e verificar que o resultado está vazio @regression', async () => {
    await formsScreen.setInputText('temporary text');
    await formsScreen.clearInputText();

    const result = await formsScreen.getInputResult();
    expect(result).to.satisfy((val: string) => val === '' || val === undefined || val === null);
  });
});
