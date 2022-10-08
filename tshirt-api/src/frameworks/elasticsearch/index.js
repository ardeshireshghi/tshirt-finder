const config = require('../config');
const { Client } = require('@elastic/elasticsearch');

function createClient() {
  return new Client({
    node: config.elasticsearch.host,
  });
}

async function createIndex(client, indexName) {
  await client.indices.create({ index: indexName });
}

exports.createIndex = createIndex;
exports.createClient = createClient;
