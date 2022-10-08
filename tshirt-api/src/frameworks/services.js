const config = require('./config');
const TShirtSearchAdapter = require('../interface-adapters/tshirt-search-adapter');
const { createClient } = require('./elasticsearch');

exports.tshirtSearchAdapter = new TShirtSearchAdapter(
  createClient(),
  config.tshirtIndexName
);
