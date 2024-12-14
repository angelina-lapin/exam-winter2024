import '../assets/scss/styles.scss';

import {
  renderItems,
  setupSearch,
  setupCardLinks,
  updateWelcomeSection,
} from './home.js';
import { fetchAuctions } from './api.js';
import { renderProductDetails } from './product.js';

const app = document.getElementById('app');

const routes = {
  home: '/src/pages/home.html',
  login: '/src/pages/login.html',
  register: '/src/pages/registration.html',
  profile: '/src/pages/profile.html',
  product: '/src/pages/product.html',
};

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function updateNavigation() {
  const nav = document.querySelector('.navbar-nav');
  if (!nav) {
    console.warn('Navigation container not found');
    return;
  }

  nav.innerHTML = '';

  if (isAuthenticated()) {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="profile">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="login">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="register">Register</a>
      </li>
    `;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.history.pushState({ page: 'home' }, '', '/');
      loadPage('home');
    });
  }
}

function createContainer(parent) {
  const container = document.createElement('div');
  container.classList.add('container');
  parent.appendChild(container);
  return container;
}

async function loadPage(page) {
  if (!app) {
    console.warn('App container not found.');
    return;
  }

  console.log('Loading page:', routes[page]);

  try {
    const res = await fetch(routes[page]);
    if (!res.ok) {
      console.error('Error fetching page:', res.status, res.statusText);
      app.innerHTML = `<p>Error loading page. Please try again later.</p>`;
      return;
    }

    const content = await res.text();
    app.innerHTML = `
      <header class="navbar navbar-expand-lg navbar-dark bg-dark-green">
  <div class="container">
    <a class="navbar-brand" href="/">
      <img
        src="/assets/logo.png"  
        alt="AuctionPlace Logo"
        class="logo"
      />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto"></ul> 
    </div>
  </div>
</header>


      ${content}

      <footer class="footer bg-dark-green text-white text-center py-3">
        <p>&copy; 2024 AuctionPlace. All rights reserved.</p>
      </footer>
    `;
    updateNavigation();

    if (page === 'home') {
      let welcomeSection = document.querySelector('.welcome-section');
      if (!welcomeSection) {
        console.warn(
          'Welcome section not found in fetched content. Adding default structure...'
        );
        const container =
          app.querySelector('.container') || createContainer(app);
        container.insertAdjacentHTML(
          'afterbegin',
          `<div class="welcome-section mb-4"></div>`
        );
        welcomeSection = container.querySelector('.welcome-section');
      }

      updateWelcomeSection(welcomeSection);

      let itemsGrid = document.querySelector('#items-grid');
      let pagination = document.querySelector('#pagination');

      if (!itemsGrid || !pagination) {
        const container =
          app.querySelector('.container') || createContainer(app);

        if (!itemsGrid) {
          container.insertAdjacentHTML(
            'beforeend',
            `<div id="items-grid" class="row"></div>`
          );
        }
        if (!pagination) {
          container.insertAdjacentHTML(
            'beforeend',
            `<div id="pagination" class="d-flex justify-content-center mt-4"></div>`
          );
        }

        itemsGrid = document.querySelector('#items-grid');
        pagination = document.querySelector('#pagination');
      }

      try {
        const { items } = await fetchAuctions();
        await renderItems(items);
        setupSearch();
        setupCardLinks();
      } catch (error) {
        console.error('Error loading home page:', error);
      }
    } else if (page === 'product') {
      const productId = new URLSearchParams(window.location.search).get('id');
      if (productId) {
        await renderProductDetails(productId);
      } else {
        console.error('Product ID not found in URL');
        app.innerHTML = `<p>Product not found.</p>`;
      }
    }
  } catch (error) {
    console.error('Error loading page:', error);
    app.innerHTML = `<p>Error loading content. Please try again later.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('a[href]');
    if (target) {
      const href = target.getAttribute('href');
      if (href.startsWith('/src/pages/')) {
        event.preventDefault();
        const page = Object.keys(routes).find((key) =>
          href.includes(routes[key])
        );
        if (page) {
          window.history.pushState({ page }, '', href);
          loadPage(page);
        }
      }
    }
  });

  loadPage('home');

  window.addEventListener('popstate', (event) => {
    const page = event.state?.page || 'home';
    loadPage(page);
  });
});
