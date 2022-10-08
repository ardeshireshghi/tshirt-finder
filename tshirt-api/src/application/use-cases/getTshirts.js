const TShirt = require('../../domain/tshirt');

function createGetTshirtsUseCase({ tshirtSearchAdapter }) {
  async function findTshirtUseCase() {
    const result = await tshirtSearchAdapter.search();
    return result.map((item) => new TShirt(item));
  }

  return findTshirtUseCase;
}

module.exports = createGetTshirtsUseCase;
