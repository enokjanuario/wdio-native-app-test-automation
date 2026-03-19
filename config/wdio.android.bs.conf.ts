import { config as sharedConfig } from './wdio.shared.conf.js';
import { BROWSERSTACK_HOSTNAME } from '../test/config/constants.js';

const buildName = process.env.CI_BUILD_NUMBER || `local-${new Date().toISOString().replace(/[:.]/g, '-')}`;

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  user: process.env.BROWSERSTACK_USER,
  key: process.env.BROWSERSTACK_KEY,
  hostname: BROWSERSTACK_HOSTNAME,
  capabilities: [{
    'platformName': 'Android',
    'appium:automationName': 'UiAutomator2',
    'bstack:options': {
      deviceName: 'Samsung Galaxy S23',
      osVersion: '13.0',
      appUrl: process.env.BROWSERSTACK_APP_URL || '',
      projectName: 'WDIO Native Demo Tests',
      buildName: buildName,
      sessionName: 'Android Tests',
      networkLogs: true,
      debug: true,
    },
  }],
  services: ['browserstack'],
};
