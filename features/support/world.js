const { setWorldConstructor, Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

class CustomWorld {
  constructor(options) {
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  async init() {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);

setDefaultTimeout(60000);

// Create a variable to store browser instance
let browser;

BeforeAll(async function () {
    console.log('Before All hook');
    const isCi = process.env.CI === 'true';
    browser = await chromium.launch({ headless: isCi, slowMo: isCi ? 0 : 100 });
});

AfterAll(async function () {
    console.log('After All hook');
    if (browser) {
        await browser.close();
    }
});

Before(async function ({ pickle }) {
    console.log(`Running scenario ${pickle.name}`);
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

After(async function ({ pickle, result }) {
    console.log(`Finished scenario ${pickle.name} with status ${result.status}`);
    if (result.status === 'failed') {
        await this.page.screenshot({ path: `test-results/screenshots/${pickle.name}.png` });
    }
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
}); 