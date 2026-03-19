# WDIO Native Demo App - Automação de Testes

Projeto de automação de testes mobile para o [WebDriverIO Native Demo App v2.0.0](https://github.com/webdriverio/native-demo-app/releases/tag/v2.0.0), construído com WebDriverIO v9 + Appium v2 em TypeScript. Cobre 45+ cenários de teste em todas as telas do app com suporte cross-platform (Android e iOS).

## Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Linguagem | TypeScript (strict mode) | Segurança de tipos, melhor suporte IDE, detecção antecipada de erros |
| Framework de Teste | WebDriverIO v9 | Última versão com suporte nativo mobile e conformidade W3C |
| Driver Mobile | Appium v2 | Padrão da indústria para automação mobile, arquitetura de plugins |
| Driver Android | UiAutomator2 | Mantido pelo Google, confiável para automação Android |
| Driver iOS | XCUITest | Framework nativo de testes da Apple, melhor suporte iOS |
| Test Runner | Mocha | Interface BDD flexível, excelente suporte a async |
| Asserções | Chai + WDIO expect | Asserções BDD expressivas com validação exata de texto |
| Relatórios | Allure Report | Relatórios HTML ricos com screenshots, steps e histórico |
| Data Driven | JSON fixtures | Dados de teste simples, legíveis e fáceis de manter |
| CI/CD | GitLab CI + GitHub Actions | Suporte a pipeline duplo para flexibilidade |
| Cloud | BrowserStack | Testes cross-device sem infraestrutura local |
| Screenshots | Automático via hook afterTest | Captura evidências de falha automaticamente |

## Arquitetura do Projeto

```
wdio-native-demo-tests/
  .github/workflows/        Pipeline CI/CD do GitHub Actions
  .gitlab-ci.yml            Pipeline CI/CD do GitLab
  apps/                     Binários APK/APP (não commitados)
  config/                   Arquivos de configuração WDIO por plataforma/ambiente
    wdio.shared.conf.ts     Configuração base compartilhada (hooks, reporters, timeouts)
    wdio.android.conf.ts    Config local Android
    wdio.ios.conf.ts        Config local iOS
    wdio.android.bs.conf.ts Config BrowserStack Android
    wdio.ios.bs.conf.ts     Config BrowserStack iOS
  test/
    config/                 Constantes centralizadas e mensagens esperadas
      constants.ts          Caminhos do app, dispositivos padrão, ajuste de gestos
      timeouts.ts           Todos os valores de timeout com justificativa JSDoc
      expected-messages.ts  Textos esperados da UI para asserções exatas
    data/                   Fixtures de dados de teste em JSON
    helpers/                Utilitários reutilizáveis
      gestures.ts           Helpers W3C Actions API (swipe, drag, scroll)
      logger.ts             Logger customizado com integração Allure step
      reporter.ts           Utilitários de relatório
      utils.ts              Helpers de plataforma
    screenobjects/          Classes Screen Object por tela do app
      components/           Componentes reutilizáveis (TabBar, NativeAlert)
    specs/                  Especificações de teste organizadas por funcionalidade
      login/                Testes de Login e Cadastro
      navigation/           Testes de navegação por abas
      forms/                Testes de elementos de formulário
      swipe/                Testes de carrossel e scroll
      drag/                 Testes de arrastar e soltar (puzzle)
      webview/              Testes de contexto WebView
      e2e/                  Testes de fluxo ponta a ponta
  screenshots/              Screenshots de falha (gerados automaticamente)
```

### Padrão Screen Object

Este projeto utiliza o padrão Screen Object em vez do tradicional Page Object Pattern. A diferença principal é que apps mobile possuem telas (não páginas), e screen objects encapsulam seletores e gestos específicos de plataforma que são únicos para testes mobile.

Todos os seletores são encapsulados como getters privados dentro dos screen objects. Specs nunca acessam seletores diretamente, apenas métodos públicos que executam ações ou retornam dados tipados.

A classe base `AppScreen` fornece helpers reutilizáveis (`waitAndClick`, `waitAndType`, `getTextFrom`, `isElementVisible`, `scrollTo`) para que as classes filhas se mantenham enxutas e DRY.

### Estratégia de Seletores

Ordem de prioridade para compatibilidade cross-platform:

1. Accessibility ID (`~seletor`) - funciona tanto no Android quanto no iOS
2. UiSelector (Android) - `android=new UiSelector().text("...")`
3. Predicate String (iOS) - `-ios predicate string:name == "..."`
4. Class Chain (iOS) - `-ios class chain:**/XCUIElementType...`

### Configuração Centralizada

Todos os magic numbers, timeouts e mensagens esperadas são centralizados em `test/config/`:

- **`timeouts.ts`** — cada timeout possui um comentário JSDoc explicando *por que* aquele valor foi escolhido
- **`constants.ts`** — caminhos do app, dispositivos padrão, parâmetros de ajuste de gestos
- **`expected-messages.ts`** — textos exatos da UI usados nas asserções (fonte única da verdade)

## Pré-requisitos

- Node.js 20+
- Java JDK 17+ (necessário para o Android SDK)
- Android Studio com Android SDK e AVD configurados
- Xcode 15+ com iOS Simulator (somente macOS)
- Appium 2.x (instalado como dependência do projeto)

## Configuração

1. Clone o repositório:
```bash
git clone <url-do-repositório>
cd wdio-native-demo-tests
```

2. Instale as dependências:
```bash
npm install
```

3. Baixe o WDIO Native Demo App **v2.0.0** e coloque no diretório `apps/`:
   - Android: [android.wdio.native.app.v2.0.0.apk](https://github.com/webdriverio/native-demo-app/releases/download/v2.0.0/android.wdio.native.app.v2.0.0.apk)
   - iOS: [ios.wdio.native.app.v2.0.0.app](https://github.com/webdriverio/native-demo-app/releases/download/v2.0.0/ios.wdio.native.app.v2.0.0.app.zip)

```bash
mkdir -p apps
curl -L -o apps/android.wdio.native.app.v2.0.0.apk \
  https://github.com/webdriverio/native-demo-app/releases/download/v2.0.0/android.wdio.native.app.v2.0.0.apk
```

4. Crie e inicie um emulador Android:
```bash
avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;x86_64"
emulator -avd Pixel_7_API_34
```

5. Inicie o Appium (em um terminal separado):
```bash
npx appium --allow-insecure chromedriver_autodownload
```

> **Nota:** A flag `--allow-insecure chromedriver_autodownload` é necessária para os testes de WebView. Ela permite que o Appium baixe automaticamente a versão do Chromedriver compatível com o Chrome do emulador.

6. (Opcional) Defina variáveis de ambiente para dispositivo customizado:
```bash
export ANDROID_DEVICE_NAME="Nome_Do_Seu_Dispositivo"
export IOS_DEVICE_NAME="iPhone 15"
export IOS_VERSION="17.4"
```

## Executando os Testes

| Comando | Descrição |
|---------|-----------|
| `npm run android` | Executar suite completa no emulador Android |
| `npm run ios` | Executar suite completa no simulador iOS |
| `npm run android:smoke` | Executar apenas testes smoke no Android |
| `npm run android:regression` | Executar testes de regressão no Android |
| `npm run android:e2e` | Executar testes E2E no Android |
| `npm run android:bs` | Executar testes no BrowserStack (Android) |
| `npm run ios:bs` | Executar testes no BrowserStack (iOS) |

Executar um spec específico:
```bash
npx wdio run config/wdio.android.conf.ts --spec test/specs/login/login.spec.ts
```

## Visualizando Relatórios

Gere e abra o Allure Report:
```bash
npm run report:generate && npm run report:open
```

O relatório inclui:
- Resumo de todos os testes executados (passou/falhou/pulou)
- Screenshots de falhas (anexados automaticamente)
- Logs de execução por teste
- Informações de ambiente (dispositivo, SO, versão do app)

## Matriz de Cobertura de Testes

| Tela | Smoke | Regressão | Boundary | E2E | Total |
|------|-------|-----------|----------|-----|-------|
| Login | 1 | 5 | 1 | - | 7 |
| Cadastro | 1 | 5 | 1 | - | 7 |
| Navegação | 2 | 2 | - | - | 4 |
| Formulários | 2 | 5 | 4 | - | 11 |
| Swipe | 1 | 2 | 1 | - | 4 |
| Arrastar | 1 | 2 | - | - | 3 |
| WebView | 1 | 2 | - | - | 3 |
| E2E | - | - | - | 2 | 2 |
| **Total** | **9** | **23** | **7** | **2** | **41** |

> Nota: Testes data-driven (opções de dropdown, entradas de texto, credenciais válidas) geram casos de teste adicionais dinamicamente em tempo de execução, elevando o total efetivo para **45+ casos de teste**.

## Decisões Técnicas

**TypeScript em vez de JavaScript**: Modo strict captura erros de tipo em tempo de compilação. Métodos dos screen objects retornam dados tipados, prevenindo erros em runtime nos specs.

**Mocha em vez de Cucumber**: Para uma audiência técnica, Mocha oferece sintaxe BDD mais limpa sem o overhead de arquivos Gherkin. Testes data-driven via fixtures JSON substituem a necessidade de Scenario Outlines.

**Configs separadas por plataforma**: Android e iOS possuem capabilities e seletores fundamentalmente diferentes. Configs separadas mantêm cada arquivo focado e evitam lógica condicional complexa.

**W3C Actions API para gestos**: O comando `touchPerform` está depreciado. W3C Actions fornece uma forma padronizada e cross-platform de executar gestos (swipe, drag, scroll) que funciona consistentemente entre drivers do Appium.

**Constantes centralizadas em vez de valores hardcoded**: Todos os timeouts, caminhos do app, parâmetros de gestos e mensagens esperadas ficam em `test/config/`. Isso elimina magic numbers, facilita ajustes e garante uma fonte única da verdade.

**NativeAlert como componente separado**: Android e iOS tratam alertas nativos do sistema de forma diferente. Android usa `com.wdiodemoapp:id/alert_title` enquanto iOS usa `XCUIElementTypeAlert`. O componente inclui um método `dismissIfPresent()` com três estratégias de fallback para cleanup robusto nos hooks.

**Asserções exatas em vez de verificações genéricas**: Specs validam mensagens de erro exatas (ex: `expect(erro).to.equal('Please enter a valid email address')`) em vez de `to.not.be.empty`. Isso captura regressões onde o app muda seu texto de validação.

## Configuração do BrowserStack

1. Defina as variáveis de ambiente:
```bash
export BROWSERSTACK_USER="seu_usuario"
export BROWSERSTACK_KEY="sua_chave_de_acesso"
```

2. Faça upload do app para o BrowserStack:
```bash
curl -u "$BROWSERSTACK_USER:$BROWSERSTACK_KEY" \
  -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
  -F "file=@apps/android.wdio.native.app.v2.0.0.apk"
```

3. Defina a URL do app retornada:
```bash
export BROWSERSTACK_APP_URL="bs://hash_do_seu_app"
```

4. Execute os testes:
```bash
npm run android:bs
```

## Contribuindo

1. Crie uma branch a partir de `main`
2. Escreva testes seguindo o padrão Screen Object
3. Garanta que todos os specs passam localmente
4. Execute `npm run lint` para verificar o estilo do código
5. Crie um pull request
