const BaseScraper = require('../../domain/scraper');

const colorMap = Object.freeze({
  black: '000000_black',
  blue: '0000ff_blue',
  white: 'ffffff_white',
});

const sizeMap = {
  m: '5_m',
  l: '6_l',
};

function colorWithNameFromColor(colorName) {
  return colorMap[colorName];
}

function sizeFromSizeName(sizeName) {
  return sizeMap[sizeName];
}

class CosTShirtScraper extends BaseScraper {
  async findTshirts({ colours, sizes } = {}) {
    const tshirtUrl = this._urlFromPreferences({
      colours,
      sizes,
    });

    console.log({ tshirtUrl });

    await this._pageAdapter.goto(tshirtUrl);

    await this._pageAdapter.waitForSelector(
      CosTShirtScraper.fields.productItem
    );

    const productsCount = await this._getProductsCount();

    await this._loadImages(productsCount);

    const products = await this._pageAdapter.findBySelector(
      CosTShirtScraper.fields.productItem
    );

    const itemPromises = products.map((productEl) => {
      return productEl.evaluate((el) => {
        const url = el.querySelector('.image-if-hover > a').href;
        const name = el.querySelector('.product-title').innerText;
        const price = el
          .querySelector('.m-product-price')
          .innerText.trim()
          .split(' ');

        const imageSrc = el.querySelector('.product-image').src;
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

    return tshirts.map((tshirt) => ({ ...tshirt, brand: 'cos' }));
  }

  get _baseUrl() {
    return 'https://www.cos.com/en_gbp/search.html?q=tshirt+men&sort=bestMatch';
  }

  async _loadImages(imageCount) {
    await this._pageAdapter.evaluate(async () => {
      let docHeight = document.documentElement.scrollHeight;
      while (window.innerHeight + window.scrollY < docHeight) {
        window.scrollBy(0, window.innerHeight);

        // Wait 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 1000));
        docHeight = document.documentElement.scrollHeight;
      }
    });

    // Wait for image loading to be resolved
    await this._pageAdapter.waitForFunction(
      (count) => {
        return (
          Math.abs(
            count -
              document.querySelectorAll('.product-image.ResolveComplete').length
          ) <= 1
        );
      },
      {},
      imageCount
    );
  }

  async _getProductsCount() {
    const counterEl = await this._pageAdapter.findBySelector('#filterResults');

    const productsCount = await counterEl[0].evaluate((el) => {
      return Number(el.textContent.match(/\d+/)[0]);
    });

    return productsCount;
  }

  _urlFromPreferences(preferences) {
    const url = new URL(this._baseUrl);
    url.searchParams.set('department', 'men_all,men_all');
    url.searchParams.set('category', 'men_menswear_tshirts_all');

    preferences.colours.forEach((color) => {
      url.searchParams.append('colorWithNames', colorWithNameFromColor(color));
    });

    preferences.sizes.forEach((size) => {
      url.searchParams.append('sizes', sizeFromSizeName(size));
    });

    return url.toString();
  }

  static get fields() {
    return {
      productItem: '.o-product',
    };
  }
}

module.exports = CosTShirtScraper;
