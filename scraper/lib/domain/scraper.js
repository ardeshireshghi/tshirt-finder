class BaseScraper {
  constructor(pageAdapter) {
    this._pageAdapter = pageAdapter;
  }

  get _baseUrl() {
    throw new Error('This need to be implemented in the child class');
  }
}

module.exports = BaseScraper;
