class TShirtIndexerAdapter {
  constructor(esClient, indexName) {
    this.esClient = esClient;
    this.indexName = indexName;
  }

  async indexItem(tshirt) {
    const result = await this.esClient.index({
      index: this.indexName,
      document: tshirt.valueOf(),
    });

    console.log(tshirt, result);
    return result;
  }
}

module.exports = TShirtIndexerAdapter;
