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

  nav.innerHTML = "";

  if (isAuthenticated()) {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="./pages/profile.html">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="./pages/login.html">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./pages/registration.html">Register</a>
      </li>
    `;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "./index.html";
    });
  }
}

async function setupHomePage() {
  console.log("Home page loaded...");

  const itemsGrid = document.getElementById("items-grid");
  const paginationContainer = document.getElementById("pagination");

  if (!itemsGrid || !paginationContainer) {
    console.error("Required containers not found.");
    return;
  }

  try {
    const itemsPerPage = 12;
    const { items, totalCount } = await fetchAuctions();

    renderItems(items, 1, itemsPerPage);
    setupPagination(paginationContainer, totalCount, 1, itemsPerPage, items);
  } catch (error) {
    console.error("Error fetching items:", error);
    itemsGrid.innerHTML =
      "<p class='text-danger text-center'>Failed to load items.</p>";
  }
}

export function renderItems(listings, currentPage, itemsPerPage) {
  const itemsGrid = document.getElementById("items-grid");

  if (!itemsGrid) {
    console.error("Items grid container not found.");
    return;
  }

  itemsGrid.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = listings.slice(startIndex, endIndex);

  if (paginatedListings.length === 0) {
    itemsGrid.innerHTML =
      "<p class='text-center'>No items available to display.</p>";
    return;
  }

  paginatedListings.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const imageHTML = item.media?.[0]?.url
      ? `<img src="${item.media[0].url}" class="card-img-top" alt="${item.title}" />`
      : "";

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

function setupPagination(
  container,
  totalItems,
  currentPage,
  itemsPerPage,
  items
) {
  container.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "btn btn-outline-dark mx-1";
    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      renderItems(items, i, itemsPerPage);
      setupPagination(container, totalItems, i, itemsPerPage, items);
    });

    container.appendChild(button);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateNavigation();
  setupHomePage();
});
