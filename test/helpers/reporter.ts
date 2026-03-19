export async function attachScreenshot(name: string): Promise<void> {
  const screenshot = await driver.takeScreenshot();
  try {
    const allure = await import('@wdio/allure-reporter');
    allure.default.addAttachment(
      name,
      Buffer.from(screenshot, 'base64'),
      'image/png',
    );
  } catch {
    // Allure reporter não disponível
  }
}
