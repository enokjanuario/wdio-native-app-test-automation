/**
 * Logger leve que escreve breadcrumbs no console
 * e (quando disponível) adiciona steps ao relatório Allure.
 */

let allureReporter: typeof import('@wdio/allure-reporter').default | null = null;

async function getAllure(): Promise<typeof allureReporter> {
  if (allureReporter) return allureReporter;
  try {
    const mod = await import('@wdio/allure-reporter');
    allureReporter = mod.default;
    return allureReporter;
  } catch {
    return null;
  }
}

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 23);
}

export class Logger {
  /** Registra um step de alto nível do teste (aparece no relatório Allure) */
  static async step(name: string, fn?: () => Promise<void>): Promise<void> {
    const allure = await getAllure();
    console.log(`  [STEP] ${timestamp()} — ${name}`);
    if (allure) {
      if (fn) {
        await allure.step(name, fn);
      } else {
        allure.addStep(name);
      }
    } else if (fn) {
      await fn();
    }
  }

  /** Mensagem informativa */
  static info(message: string): void {
    console.log(`  [INFO] ${timestamp()} — ${message}`);
  }

  /** Aviso */
  static warn(message: string): void {
    console.warn(`  [WARN] ${timestamp()} — ${message}`);
  }

  /** Erro */
  static error(message: string): void {
    console.error(`  [ERROR] ${timestamp()} — ${message}`);
  }
}
