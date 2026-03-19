export function generateTimestamp(): string {
  return Date.now().toString(36);
}

export function generateEmail(): string {
  return `test.${generateTimestamp()}@webdriver.io`;
}

export function platformSelect<T>(android: T, ios: T): T {
  return driver.isAndroid ? android : ios;
}
