import { fetchAuctions, searchListings } from './api.js';

export async function renderItems() {
  const itemsGrid = document.getElementById('items-grid');
  if (!itemsGrid) {
    console.error('Element with ID "items-grid" not found');
    return;
  }

  try {
    const response = await fetchAuctions();
    const items = response.data;

    if (!Array.isArray(items) || items.length === 0) {
      console.error('No items available or invalid data format:', items);
      itemsGrid.innerHTML =
        '<p class="text-center">No items available to display.</p>';
      return;
    }

    itemsGrid.innerHTML = '';

    items.forEach((item) => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      const imageUrl = item.media?.[0]?.url || 'default-image.jpg';
      const imageAlt = item.media?.[0]?.alt || 'No description available';
      const startingBid = item._count?.bids || 0;

      col.innerHTML = `
  <div class="card h-100 border-dark" data-id="${item.id}">
    <div class="card-img-container">
      <img src="${imageUrl}" class="card-img-top" alt="${imageAlt}" />
    </div>
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title text-dark">${item.title}</h5>
      <p class="card-text text-dark">Starting bid: ${startingBid} points</p>
      <a href="/src/pages/product.html?id=${item.id}" class="btn btn-dark">View Details</a>
    </div>
  </div>
`;

      itemsGrid.appendChild(col);
    });
  } catch (error) {
    console.error('Error during renderItems:', error);
    itemsGrid.innerHTML =
      '<p class="text-center">Error fetching items. Please try again later.</p>';
  }
}

export function setupCardLinks() {
  console.log('Setting up card links...');
  const cards = document.querySelectorAll('.card');

  if (!cards.length) {
    console.log('No cards found for setting up links.');
    return;
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const productId = card.getAttribute('data-id');
      if (!productId) {
        console.error('No product ID found on card.');
        return;
      }
      window.location.href = `/src/pages/product.html?id=${productId}`;
    });
  });
}

export function setupSearch() {
  console.log('Setting up search...');
  const searchButton = document.querySelector('.search-bar button');
  const searchInput = document.querySelector('.search-bar input');
  const itemsGrid = document.getElementById('items-grid');

  if (!searchButton || !searchInput || !itemsGrid) {
    console.error('Search elements not found');
    return;
  }

  console.log('Search button:', searchButton);
  console.log('Search input:', searchInput);
  console.log('Items grid:', itemsGrid);

  searchButton.addEventListener('click', async () => {
    console.log('Search button clicked!');
    const query = searchInput.value.trim();

    if (!query) {
      alert('Please enter a search query');
      return;
    }

    try {
      const results = await searchListings(query);
      console.log('Search results:', results);

      itemsGrid.innerHTML = '';

      if (results.length === 0) {
        itemsGrid.innerHTML = '<p class="text-center">No results found.</p>';
      } else {
        results.forEach((item) => {
          const col = document.createElement('div');
          col.className = 'col-md-4 mb-4';

          col.innerHTML = `
            <div class="card h-100">
              <div class="card-img-container">
                <img src="${item.media[0]?.url || 'default-image.jpg'}" class="card-img-top" alt="${item.media[0]?.alt || 'No description'}" />
              </div>
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Starting bid: ${item._count?.bids || 0} points</p>

              </div>
            </div>
          `;
          itemsGrid.appendChild(col);
        });
      }
    } catch (error) {
      console.error('Error during search:', error);
      itemsGrid.innerHTML =
        '<p class="text-center">Error fetching search results.</p>';
    }
  });
}
