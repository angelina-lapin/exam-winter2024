import '../assets/scss/styles.scss';

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
    app.innerHTML = content;

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
    }
  } catch (error) {
    console.error('Error loading page:', error);
    app.innerHTML = `<p>Error loading content. Please try again later.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const target = event.target.closest('a[data-route]');
    if (target) {
      event.preventDefault();
      const page = target.getAttribute('data-route');
      window.history.pushState(
        { page },
        '',
        page === 'home' ? '/' : `/${page}`
      );
      loadPage(page);
    }
  });

  loadPage('home');

  updateNavigation();

  window.addEventListener('popstate', (event) => {
    const page = event.state?.page || 'home';
    loadPage(page);
  });
});
