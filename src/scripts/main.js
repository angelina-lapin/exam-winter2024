import { fetchAuctions } from "./api.js";

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

export function updateNavigation() {
  const nav = document.querySelector(".navbar-nav");
  if (!nav) {
    console.error("Navigation container not found.");
    return;
  }

  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";

  nav.innerHTML = "";

  if (isAuthenticated()) {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="${basePath}pages/profile.html">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="${basePath}pages/login.html">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="${basePath}pages/registration.html">Register</a>
      </li>
    `;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = `${basePath}index.html`;
    });
  }
}

let currentPage = 1;
const itemsPerPage = 12;
let currentQuery = "";

async function setupHomePage() {
  console.log("Home page loaded...");

  const loadMoreButton = document.getElementById("load-more-button");

  await loadMoreItems();

  loadMoreButton.addEventListener("click", async () => {
    await loadMoreItems();
  });

  setupSearch();
}

async function loadMoreItems() {
  const itemsGrid = document.getElementById("items-grid");
  const loadMoreButton = document.getElementById("load-more-button");

  try {
    console.log(`Fetching page ${currentPage} with query: "${currentQuery}"`);
    const { items, totalCount } = await fetchAuctions(
      currentPage,
      itemsPerPage,
      currentQuery
    );

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);

    if (items.length === 0 && currentPage === 1) {
      itemsGrid.innerHTML =
        "<p class='text-center'>No results found for your search.</p>";
      loadMoreButton.disabled = true;
      return;
    }

    renderItems(items);

    currentPage++;
    console.log(`Items rendered: ${itemsGrid.children.length}`);

    if (currentPage > totalPages) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "No more items to load";
    }
  } catch (error) {
    console.error("Error loading more items:", error);
    loadMoreButton.textContent = "Error loading items";
  }
}

function renderItems(listings) {
  const itemsGrid = document.getElementById("items-grid");

  if (!itemsGrid) {
    console.error("Items grid container not found.");
    return;
  }

  if (!listings || listings.length === 0) {
    itemsGrid.innerHTML = "<p class='text-center'>No items available.</p>";
    return;
  }

  listings.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const imageHTML = item.media?.[0]?.url
      ? `<img src="${item.media[0].url}" class="card-img-top" alt="${item.title}" />`
      : `<div class="placeholder-img">No image available</div>`;

    col.innerHTML = `
      <div class="card h-100">
        ${imageHTML}
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
           <p class="card-text">Starting bid: ${item._count?.bids || 0} points</p>
          <a href="./pages/product.html?id=${item.id}" class="btn btn-dark">View Details</a>
        </div>
      </div>
    `;
    itemsGrid.appendChild(col);
  });
}

function setupSearch() {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const itemsGrid = document.getElementById("items-grid");
  const loadMoreButton = document.getElementById("load-more-button");

  searchButton.addEventListener("click", async () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    itemsGrid.innerHTML = "";
    loadMoreButton.disabled = false;
    await loadMoreItems();
  });

  searchInput.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
      currentQuery = searchInput.value.trim();
      currentPage = 1;
      itemsGrid.innerHTML = "";
      loadMoreButton.disabled = false;
      await loadMoreItems();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavigation();
  setupHomePage();
  setupSearch();
});
