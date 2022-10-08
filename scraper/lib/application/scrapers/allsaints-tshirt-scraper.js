const BaseScraper = require('../../domain/scraper');

class AllSaintsTShirtScraper extends BaseScraper {
  async findTshirts({ colours, sizes } = {}) {
    await this._pageAdapter.goto(
      this._urlFromPreferences({
        colours,
        sizes,
      })
    );

    const cookieBtn = await this._pageAdapter.findBySelector(
      AllSaintsTShirtScraper.fields.cookieBtn
    );

    if (cookieBtn.length > 0) {
      await this._pageAdapter.click(AllSaintsTShirtScraper.fields.cookieBtn);
    }

    await this._pageAdapter.waitForSelector(
      AllSaintsTShirtScraper.fields.productItem
    );

    const products = await this._pageAdapter.findBySelector(
      AllSaintsTShirtScraper.fields.productItem
    );
    const itemPromises = products.map((productEl) => {
      return productEl.evaluate((el) => {
        const url = el.querySelector('a.mainImg').href;
        const name = el.querySelector('.product-item__name__text').innerText;
        const price = el
          .querySelector('.product-item__price')
          .innerText.trim()
          .split(' ');

        const imageSrc = el.querySelector('img').src;

        return {
          name,
          url,
          price: price.length > 1 ? price[1] : price[0],
          imageSrc,
        };
      });
    });

    const tshirts = await Promise.all(itemPromises);
    await this._pageAdapter.closePage();

    return tshirts.map((tshirt) => ({ ...tshirt, brand: 'allsaints' }));
  }

  get _baseUrl() {
    return 'https://www.allsaints.com/men/t-shirts/';
  }

  _urlFromPreferences(preferences) {
    const style = 'any';
    const colours = preferences.colours.join('+');
    const sizes = preferences.sizes.join('+');
    const sleeveLength = 'short';
    const urlParams = [
      `style,${style}`,
      `colour,${colours}`,
      `size,${sizes}`,
      `sleeve_length,${sleeveLength}`,
    ]
      .join('/')
      .concat('/');

    return `${this._baseUrl}${urlParams}`;
  }

  static get fields() {
    return {
      cookieBtn: '#onetrust-accept-btn-handler',
      productItem: '.product-item',
    };
  }
}

module.exports = AllSaintsTShirtScraper;
