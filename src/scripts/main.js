const app = document.getElementById('app');

const routes = {
  home: './src/pages/home.html',
  login: './src/pages/login.html',
  register: './src/pages/register.html',
};

async function loadPage(page) {
  const res = await fetch(routes[page]);
  const content = await res.text();
  app.innerHTML = content;

  if (page === 'home') {
    import('./home.js').then((module) => module.renderItems());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPage('home');
});
