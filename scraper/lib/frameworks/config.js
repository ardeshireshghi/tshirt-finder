const chromium = require('chrome-aws-lambda');

module.exports = {
  browserConfig: process.env.SERVERLESS
    ? {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      }
    : {
        headless: !!process.env.DOCKER_PUPPETEER,
        defaultViewport: null,
        args: !!process.env.DOCKER_PUPPETEER
          ? [
              // Required for Docker version of Puppeteer
              '--no-sandbox',
              '--disable-setuid-sandbox',
              // This will write shared memory files into /tmp instead of /dev/shm,
              // because Docker’s default for /dev/shm is 64MB
              '--disable-dev-shm-usage',
            ]
          : [],
      },
  tshirtIndexName: 'tshirts',
  elasticsearch: {
    host: process.env.ES_HOST || 'http://localhost:9200',
  },
};
