class PageAdapter {
  constructor(page) {
    this._page = page;
  }

  async goto(url) {
    await this._page.setDefaultNavigationTimeout(0);
    await this._page.goto(url, { waitUntil: 'networkidle0' });
  }

  async evaluate(fnToInvoke) {
    const result = await this._page.evaluate(fnToInvoke);
    return result;
  }

  async findBySelector(selector, pageFunction) {
    const elements = await this._page.$$(
      selector,
      pageFunction ? pageFunction : (els) => els
    );
    return elements;
  }

  async reload() {
    await this._page.reload({
      waitUntil: ['networkidle0', 'domcontentloaded'],
    });
  }

  get url() {
    return this._page.url();
  }

  async click(selector) {
    await this._page.$eval(selector, (el) => el.click());
  }

  async type(selector, value) {
    await this._page.type(selector, value);
  }

  async goto(url) {
    await this._page.goto(url);
  }

  async evaluate(evalFn) {
    await this._page.evaluate(evalFn);
  }

  async waitForNavigation() {
    await this._page.waitForNavigation();
  }

  async waitForSelector(selector, options = {}) {
    await this._page.waitForSelector(selector, options);
  }

  async waitForFunction(fn, options = {}, ...args) {
    await this._page.waitForFunction(fn, options, ...args);
  }

  async closePage() {
    await this._page.close();
  }
}

module.exports = PageAdapter;
