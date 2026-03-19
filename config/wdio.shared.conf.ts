import type { Options } from '@wdio/types';
import * as fs from 'fs';
import * as path from 'path';
import {
  WDIO_WAITFOR_TIMEOUT,
  CONNECTION_RETRY_TIMEOUT,
  CONNECTION_RETRY_COUNT,
  MOCHA_TEST_TIMEOUT,
} from '../test/config/timeouts.js';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: [
    path.join(process.cwd(), 'test', 'specs', '**', '*.spec.ts'),
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: WDIO_WAITFOR_TIMEOUT,
  connectionRetryTimeout: CONNECTION_RETRY_TIMEOUT,
  connectionRetryCount: CONNECTION_RETRY_COUNT,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: MOCHA_TEST_TIMEOUT,
  },
  reporters: [
    'spec',
    ['allure', {
      outputDir: './allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],
  // ---------------------------------------------------------------------------
  // Hooks — dispensa centralizada de alertas + screenshots de falha
  // ---------------------------------------------------------------------------
  beforeTest: async function (): Promise<void> {
    // Dispensa qualquer alerta remanescente de um teste anterior.
    // Usa getAlertText como verificação — evita auto-retry do WDIO no dismissAlert.
    try {
      await driver.getAlertText();
      await driver.acceptAlert();
    } catch {
      // Nenhum alerta presente — esperado para a maioria dos testes
    }
  },
  afterTest: async function (
    test: Record<string, unknown>,
    _context: Record<string, unknown>,
    { error }: { error?: Error; result?: unknown; duration: number; passed: boolean; retries: { limit: number; attempts: number } },
  ): Promise<void> {
    if (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const testName = String(test.title).replace(/\s+/g, '_');
      const screenshotName = `${testName}_${timestamp}`;
      const screenshotPath = path.join('./screenshots', `${screenshotName}.png`);

      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(screenshotPath, screenshot, 'base64');

      try {
        const allure = await import('@wdio/allure-reporter');
        allure.default.addAttachment(
          `Screenshot - ${test.title}`,
          Buffer.from(screenshot, 'base64'),
          'image/png',
        );
      } catch {
        // Allure reporter não disponível
      }
    }
  },
  onComplete: function (): void {
    // eslint-disable-next-line no-console
    console.log('Execução dos testes concluída.');
  },
};
