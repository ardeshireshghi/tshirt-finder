class TShirt {
  constructor({ brand, name, url, price, imageSrc }) {
    this.name = name;
    this.url = url;
    this.price = price;
    this.imageSrc = imageSrc;
    this.brand = brand;
  }

  valueOf() {
    return {
      brand: this.brand,
      name: this.name,
      url: this.url,
      price: this.price,
      imageSrc: this.imageSrc,
    };
  }
}

module.exports = TShirt;
