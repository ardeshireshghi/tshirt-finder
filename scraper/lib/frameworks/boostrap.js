const { createPage, launchBrowser } = require('./pupeteer');
const config = require('./config');
const {
  createClient: createESClient,
  createIndex: createESIndex,
} = require('./elasticsearch');

const AllSaintsTShirtScraper = require('../application/scrapers/allsaints-tshirt-scraper');
const CosTShirtScraper = require('../application/scrapers/cos-tshirt-scraper');
const PageAdapter = require('../interface-adapters/page-adapter');
const TShirtIndexerAdapter = require('../interface-adapters/tshirts-indexer-adapter');
const TShirt = require('../domain/tshirt');
const userAgent = require('user-agents');

const esClient = createESClient();
const tshirtIndexer = new TShirtIndexerAdapter(
  esClient,
  config.tshirtIndexName
);

async function createPageAdapter(browser, { randomUserAgent = false } = {}) {
  const page = await createPage(browser);
  if (randomUserAgent) {
    await page.setUserAgent(userAgent.random().toString());
  }

  return new PageAdapter(page);
}

async function run() {
  const browser = await launchBrowser();
  const allSaintsScraper = new AllSaintsTShirtScraper(
    await createPageAdapter(browser, { randomUserAgent: true })
  );
  const cosScraper = new CosTShirtScraper(await createPageAdapter(browser));

  try {
    await createESIndex(esClient, config.tshirtIndexName);
  } catch (err) {
    if (!err.message.includes('resource_already_exists_exception')) {
      throw err;
    }
  }

  try {
    const preferences = {
      colours: ['black', 'blue', 'white'],
      sizes: ['l', 'm'],
    };

    const result = await Promise.all([
      allSaintsScraper.findTshirts(preferences),
      cosScraper.findTshirts(preferences),
    ]);

    const tshirts = result.flat().map((item) => new TShirt(item));

    // Index t-shirts
    await Promise.all(
      tshirts.map((tshirt) => {
        return tshirtIndexer.indexItem(tshirt);
      })
    );
  } finally {
    browser.close();
  }
}

exports.run = run;
