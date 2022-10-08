class TShirtSearchAdapter {
  constructor(esClient, indexName) {
    this.esClient = esClient;
    this.indexName = indexName;
  }

  async search() {
    try {
      const result = await this.esClient.search({
        index: this.indexName,
        body: {
          query: {
            match_all: {}
          },
          size: 1000
        }
      });

      return result.hits.hits.map((item) => item._source);
    } catch (err) {
      if (err.name === 'ConnectionError') {
        throw err;
      }
      console.log('Error searching from ES', err);
      return Promise.resolve([]);
    }
  }
}

module.exports = TShirtSearchAdapter;
