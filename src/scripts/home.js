import { fetchAuctions } from './api.js';

export async function renderItems() {
  const itemsGrid = document.getElementById('items-grid');
  const items = await fetchAuctions();

  items.forEach((item) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
  <div class="card h-100">
    <div class="card-img-container">
      <img src="${item.media[0] || 'default-image.jpg'}" class="card-img-top" alt="${item.title}" />
    </div>
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text">Starting bid: ${item.price} kr</p>
    </div>
  </div>
`;
    itemsGrid.appendChild(col);
  });
}
