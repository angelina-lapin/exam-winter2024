import { renderItems, setupSearch, setupCardLinks } from './home.js';
import { fetchAuctions, fetchUserListings } from './api.js';

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
      window.location.href = '/index.html';
    });
  }
}

async function loadPage(page) {
  if (!app) {
    console.warn('App container not found. Skipping loadPage logic.');
    return;
  }

  const res = await fetch(routes[page]);
  const content = await res.text();
  app.innerHTML = content;

  if (page === 'home') {
    console.log('Home page loaded, setting up search...');
    let allListings = [];

    try {
      const { items } = await fetchAuctions();
      console.log('General Listings:', items);

      allListings = [...items];

      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.data.name) {
        try {
          const userListings = await fetchUserListings(user.data.name);
          console.log('User Listings:', userListings);

          const uniqueUserListings = userListings.filter(
            (userListing) =>
              !items.some(
                (generalListing) => generalListing.id === userListing.id
              )
          );

          allListings = [...allListings, ...uniqueUserListings];
        } catch (userListingsError) {
          console.error('Error fetching user listings:', userListingsError);
        }
      }

      renderItems(allListings);
      updateHomePage();
      setupSearch();

      setupCardLinks();
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  }
}

function updateHomePage() {
  const welcomeSection = document.querySelector('.welcome-section');

  if (!welcomeSection) {
    console.error('Welcome section not found in DOM');
    return;
  }

  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.data?.name || 'User';

    welcomeSection.innerHTML = `
      <div class="container">
        <h1>Welcome to AuctionPlace, ${userName}!</h1>
        <p>Start bidding on items or put up your own for auction.</p>
        <div class="search-bar d-flex justify-content-center mt-4">
          <input
            id="search-input"
            type="text"
            class="form-control w-50 me-2"
            placeholder="Search for items"
          />
          <button id="search-button" class="btn btn-outline-dark">Search</button>
        </div>
      </div>
    `;
  } else {
    welcomeSection.innerHTML = `
      <div class="container">
        <h1>Welcome to AuctionPlace!</h1>
        <p>Start bidding on items or put up your own for auction.</p>
        <div class="search-bar d-flex justify-content-center mt-4">
          <input
            id="search-input"
            type="text"
            class="form-control w-50 me-2"
            placeholder="Search for items"
          />
          <button id="search-button" class="btn btn-outline-dark">Search</button>
        </div>
        <button class="btn btn-dark mt-4">Register now and get 1000 credits</button>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPage('home');
  updateNavigation();
});
