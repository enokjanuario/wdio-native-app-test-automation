import { config as sharedConfig } from './wdio.shared.conf.js';
import { APP_PATHS, DEVICE_DEFAULTS, APPIUM_PORT } from '../test/config/constants.js';
import { APPIUM_COMMAND_TIMEOUT } from '../test/config/timeouts.js';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  port: APPIUM_PORT,
  capabilities: [{
    'platformName': 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE_NAME || DEVICE_DEFAULTS.ios.deviceName,
    'appium:platformVersion': process.env.IOS_VERSION || DEVICE_DEFAULTS.ios.platformVersion,
    'appium:app': APP_PATHS.ios,
    'appium:newCommandTimeout': APPIUM_COMMAND_TIMEOUT,
  }],
};
