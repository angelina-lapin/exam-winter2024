import { fetchAuctions, searchListings } from './api.js';

export async function renderItems(
  listings = [],
  currentPage = 1,
  itemsPerPage = 50
) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  app.innerHTML = `
  <div class="container">
    <div class="welcome-section mb-4"></div>
    <div id="items-grid" class="row"></div>
    <div id="pagination" class="d-flex justify-content-center mt-4"></div>
  </div>
`;

  const itemsGrid = document.getElementById('items-grid');
  const paginationContainer = document.getElementById('pagination');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = listings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!Array.isArray(paginatedListings) || paginatedListings.length === 0) {
    itemsGrid.innerHTML =
      '<p class="text-center">No items available to display.</p>';
    return;
  }

  itemsGrid.innerHTML = '';
  paginatedListings.forEach((item) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
      <div class="card h-100">
        <div class="card-img-container">
          <img src="${item.media?.[0]?.url || 'default-image.jpg'}" class="card-img-top" alt="${item.media?.[0]?.alt || 'No description'}" />
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">Starting bid: ${item._count?.bids || 0} points</p>
          <a href="/src/pages/product.html?id=${item.id}" class="btn btn-dark">View Details</a>
        </div>
      </div>
    `;
    itemsGrid.appendChild(col);
  });

  setupPagination(
    paginationContainer,
    Math.ceil(listings.length / itemsPerPage),
    currentPage,
    listings
  );
}

export function setupCardLinks() {
  console.log('Setting up card links...');
  const cards = document.querySelectorAll('.card');

  if (!cards.length) {
    console.log('No cards found for setting up links.');
    return;
  }

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        return;
      }
      const productId = card.getAttribute('data-id');
      if (!productId) {
        console.error('No product ID found on card.');
        return;
      }
      window.location.href = `/src/pages/product.html?id=${productId}`;
    });
  });
}

export function setupPagination(container, totalPages, currentPage, listings) {
  container.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.className = 'btn btn-outline-dark mx-1';
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => renderItems(listings, i));
    container.appendChild(button);
  }
}

export function setupSearch() {
  console.log('Setting up search...');
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const itemsGrid = document.getElementById('items-grid');

  if (!searchButton || !searchInput || !itemsGrid) {
    console.error('Search elements not found');
    return;
  }

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
                <img src="${item.media?.[0]?.url || 'default-image.jpg'}" class="card-img-top" alt="${item.media?.[0]?.alt || 'No description'}" />
              </div>
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Starting bid: ${item._count?.bids || 0} points</p>
                <a href="/src/pages/product.html?id=${item.id}" class="btn btn-dark">View Details</a>
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
