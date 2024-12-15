const app = document.getElementById('app');

const routes = {
  home: './pages/home.html',
  login: './pages/login.html',
  register: './pages/registration.html',
  profile: './pages/profile.html',
  product: './pages/product.html',
};

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function updateNavigation() {
  const nav = document.querySelector('.navbar-nav');
  if (!nav) return;

  nav.innerHTML = '';

  if (isAuthenticated()) {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="profile">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="login">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="register">Register</a>
      </li>
    `;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.history.pushState({}, '', '/');
      loadPage('home');
    });
  }
}

async function loadPage(page) {
  if (!routes[page]) {
    console.error(`Route "${page}" not found.`);
    app.innerHTML = `<p class="text-danger text-center">Page not found: ${page}</p>`;
    return;
  }

  try {
    const response = await fetch(routes[page]);
    if (!response.ok) throw new Error(`Failed to fetch ${routes[page]}`);
    const content = await response.text();
    app.innerHTML = content;

    if (page === 'home') {
      setupHomePage();
    } else if (page === 'login') {
      setupLoginPage();
    } else if (page === 'register') {
      setupRegisterPage();
    } else if (page === 'profile') {
      setupProfilePage();
    } else if (page === 'product') {
      setupProductPage();
    }
  } catch (error) {
    console.error('Error loading page:', error);
    app.innerHTML = `<p class="text-danger text-center">Error loading ${page}</p>`;
  }
}

function setupHomePage() {
  console.log('Home page loaded...');
  import('./home.js').then((module) => {
    fetchAuctions().then(({ items }) => {
      if (!items.length) {
        console.warn('No items found to render.');
      }
      module.renderItems(items); 
    });
    module.setupSearch();
    module.setupCardLinks();
  });
}

function setupLoginPage() {
  console.log('Login page loaded...');
  import('./scripts/forms.js').then((module) => {
    module.setupLoginForm();
  });
}

function setupRegisterPage() {
  console.log('Register page loaded...');
  import('./scripts/forms.js').then((module) => {
    module.setupRegisterForm();
  });
}

function setupProfilePage() {
  console.log('Profile page loaded...');
  import('./profile.js').then((module) => {
    module.renderProfile();
    module.setupAvatarChange();
    module.setupBannerChange();
    module.setupCreateListingForm();
    module.renderUserListings();
  });
}

function setupProductPage() {
  console.log('Product page loaded...');
  const productId = new URLSearchParams(window.location.search).get('id');
  if (!productId) {
    console.error('Product ID not found in URL');
    app.innerHTML = '<p class="text-danger text-center">Product not found.</p>';
    return;
  }
  import('./product.js').then((module) => {
    module.renderProductDetails();
    module.setupBidForm(productId);
    module.renderBids(productId);
  });
}

document.body.addEventListener('click', (event) => {
  const target = event.target.closest('a');
  if (target && target.getAttribute('href') && !target.getAttribute('href').startsWith('http')) {
    event.preventDefault();
    const page = target.getAttribute('href');
    window.history.pushState({}, '', page);
    loadPage(page);
  }
});

window.addEventListener('popstate', () => {
  const path = window.location.pathname.split('/').pop();
  loadPage(path || 'home');
});

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();
  loadPage(path || 'home');
  updateNavigation();
});
