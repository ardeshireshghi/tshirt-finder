const puppeteer = require('puppeteer');
const config = require('./config');

exports.createPage = async (browser) => {
  const page = await browser.newPage();
  return page;
};

exports.launchBrowser = async () => {
  const browser = await puppeteer.launch(config.browserConfig);
  return browser;
};
