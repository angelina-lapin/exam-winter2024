import { searchListings } from './api.js';

export async function renderItems(
  listings = [],
  currentPage = 1,
  itemsPerPage = 50
) {
  const itemsGrid = document.getElementById('items-grid');
  const paginationContainer = document.getElementById('pagination');

  if (!itemsGrid || !paginationContainer) {
    console.error('Required containers not found.');
    return;
  }

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

export function updateWelcomeSection(welcomeSection) {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.data?.name || 'Guest';

  welcomeSection.innerHTML = `
    <div class="container-fluid welcome-section text-center text-white bg-dark-green py-5">
      <h1>Welcome to AuctionPlace, ${userName}!</h1>
      <p>Start bidding on items or put up your own for auction.</p>
      <div class="search-bar d-flex justify-content-center mt-4">
        <input id="search-input" type="text" class="form-control w-50 me-2" placeholder="Search for items">
        <button id="search-button" class="btn btn-outline-dark">Search</button>
      </div>
      ${
        user
          ? ''
          : '<button class="btn btn-dark mt-4">Register now and get 1000 credits</button>'
      }
    </div>
  `;
}

export function setupCardLinks() {
  const cards = document.querySelectorAll('.card');

  if (!cards.length) {
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
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const itemsGrid = document.getElementById('items-grid');

  if (!searchButton || !searchInput || !itemsGrid) {
    console.error('Search elements not found');
    return;
  }

  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();

    if (!query) {
      alert('Please enter a search query');
      return;
    }

    try {
      const results = await searchListings(query);

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
