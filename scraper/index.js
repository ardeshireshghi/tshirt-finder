const { run } = require('./lib/frameworks/boostrap');

module.exports.handle = async () => {
  try {
    await run();
  } catch (err) {
    console.error('Error scraping', err);
    throw err;
  }
};

if (require.main === module) {
  (async () => {
    await module.exports.handle();
  })();
}
