module.exports = {
  tshirtIndexName: 'tshirts',
  elasticsearch: {
    host: process.env.ES_HOST || 'http://localhost:9200'
  }
};
