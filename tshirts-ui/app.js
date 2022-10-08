import config from './config.js';

const Selectors = {
  container: '.js-tshirts-container',
};

async function getTshirts() {
  const result = await fetch(`${config.apiUrl}/api/v1/tshirts`);

  if (!result.ok) {
    throw new Error('Error getting tshirts');
  }

  const tshirts = await result.json();
  return tshirts.data.filter((tshirt) => !!tshirt.name) ?? [];
}

function createText(text) {
  return document.createTextNode(text).textContent;
}

function renderTshirts(container, tshirts) {
  const tshirtItems = tshirts
    .map((tshirt) => {
      const name = createText(tshirt.name);
      const brand = createText(tshirt.brand).replace(
        /^./,
        tshirt.brand.charAt(0).toUpperCase()
      );

      return `
        <div class="tshirt__item">
           <a href="${createText(tshirt.url)}" target="_blank" title="${name}">
             <div class="tshirt__image" style="background-image: url(${createText(
               tshirt.imageSrc
             )})" alt="${createText(tshirt.name)}"></div>
           </a>
           <div class="tshirt__name">${name}</div>
           <div class="tshirt__brand">${brand}</div>
           <div class="tshirt__price">${createText(tshirt.price)}</div>
        </div>
        `;
    })
    .join('');

  container.innerHTML = tshirtItems;
}

function init() {
  getTshirts().then((tshirts) => {
    const container = document.querySelector(Selectors.container);
    renderTshirts(container, tshirts);
  });
}

init();
