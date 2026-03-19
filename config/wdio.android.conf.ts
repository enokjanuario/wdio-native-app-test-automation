import { config as sharedConfig } from './wdio.shared.conf.js';
import { APP_PATHS, DEVICE_DEFAULTS, APPIUM_PORT } from '../test/config/constants.js';
import { APPIUM_COMMAND_TIMEOUT } from '../test/config/timeouts.js';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  port: APPIUM_PORT,
  maxInstances: 1,
  capabilities: [{
    'platformName': 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || DEVICE_DEFAULTS.android.deviceName,
    'appium:app': APP_PATHS.android,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': APPIUM_COMMAND_TIMEOUT,
    'appium:chromedriverAutodownload': true,
  }],
};
