import { fetchAuctions } from "./api/api.js";

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

export function updateNavigation() {
  const navbarContainer = document.querySelector(".navbar-collapse");

  if (!navbarContainer) {
    console.error("Navbar container not found. Check your HTML structure.");
    return;
  }

  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";

  navbarContainer.innerHTML = `
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
      <ul class="navbar-nav ms-auto">
        ${
          isAuthenticated()
            ? `
          <li class="nav-item">
            <a class="nav-link" href="${basePath}pages/profile.html">Profile</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
          </li>
        `
            : `
          <li class="nav-item">
            <a class="nav-link" href="${basePath}pages/login.html">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="${basePath}pages/registration.html">Register</a>
          </li>
        `
        }
      </ul>
    </div>
  `;

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
  const loadMoreButton = document.getElementById("load-more-button");
  if (!loadMoreButton) {
    console.warn("Homepage elements not found. Skipping homepage setup.");
    return;
  }

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
    const { items, totalCount } = await fetchAuctions(
      currentPage,
      itemsPerPage,
      currentQuery
    );

    if (!itemsGrid || !loadMoreButton) {
      console.warn(
        "Load more elements not found. Skipping loadMoreItems setup."
      );
      return;
    }

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    if (items.length === 0 && currentPage === 1) {
      itemsGrid.innerHTML =
        "<p class='text-center'>No results found for your search.</p>";
      loadMoreButton.disabled = true;
      return;
    }

    renderItems(items);

    currentPage++;

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

  if (!searchButton || !searchInput || !itemsGrid || !loadMoreButton) {
    console.warn("Search elements not found. Skipping search setup.");
    return;
  }

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
