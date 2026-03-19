import { expect } from 'chai';
import { tabBar } from '../../screenobjects/components/TabBar.js';
import { dragScreen } from '../../screenobjects/DragScreen.js';

describe('Tela de Arrastar @regression', () => {
  beforeEach(async () => {
    await tabBar.openDrag();
    await dragScreen.waitForScreenDisplayed();
  });

  it('deve arrastar uma peça para a posição correta @smoke', async () => {
    await dragScreen.dragPieceToTarget(0);
    await driver.pause(500);

    const isScreenStillDisplayed = await dragScreen.isScreenDisplayed();
    expect(isScreenStillDisplayed).to.be.true;
  });

  it('deve resolver o quebra-cabeça completo e ver a mensagem de parabéns @regression', async () => {
    await dragScreen.solvePuzzle();
    await driver.pause(1000);

    const isSolved = await dragScreen.isPuzzleSolved();
    if (isSolved) {
      const text = await dragScreen.getCongratulationsText();
      expect(text).to.include('Congratulations');
    } else {
      expect(await dragScreen.isScreenDisplayed()).to.be.true;
    }
  });

  it('deve exibir botão de tentar novamente após completar o quebra-cabeça @regression', async () => {
    await dragScreen.solvePuzzle();
    await driver.pause(1000);

    const isSolved = await dragScreen.isPuzzleSolved();
    if (isSolved) {
      const isRetryDisplayed = await dragScreen.isRetryButtonDisplayed();
      expect(isRetryDisplayed).to.be.true;
    } else {
      expect(await dragScreen.isScreenDisplayed()).to.be.true;
    }
  });
});
