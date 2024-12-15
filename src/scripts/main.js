import {
  renderItems,
  setupSearch,
  setupCardLinks,
  updateWelcomeSection,
} from './home.js';
import { fetchAuctions } from './api.js';

const app = document.getElementById('app');

const routes = {
  home: '/src/pages/home.html',
  login: '/src/pages/login.html',
  register: '/src/pages/registration.html',
  profile: '/src/pages/profile.html',
};

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function updateNavigation() {
  const nav = document.querySelector('.navbar-nav');
  nav.innerHTML = '';

  if (isAuthenticated()) {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="/src/pages/profile.html">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="/src/pages/login.html">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/src/pages/registration.html">Register</a>
      </li>
    `;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/src/index.html';
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

  const res = await fetch(routes[page]);
  const content = await res.text();
  app.innerHTML = content;

  if (page === 'home') {
    console.log('Home page loaded...');

    let welcomeSection = document.querySelector('.welcome-section');
    if (!welcomeSection) {
      console.warn(
        'Welcome section not found in fetched content. Adding default structure...'
      );
      const container = app.querySelector('.container') || createContainer(app);
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
     
      const container = app.querySelector('.container') || createContainer(app);

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
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPage('home');
  updateNavigation();
});