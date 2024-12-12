import { fetchProductById, addBid } from './api.js';
import { isAuthenticated, updateNavigation } from './main.js';
import { API_AUCTION_LISTINGS } from '../js/constants.js';

export async function renderProductDetails() {
  const productContainer = document.getElementById('product-details');
  if (!productContainer) {
    console.error('Product container not found');
    return;
  }

  try {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
      console.error('Product ID not found in URL');
      productContainer.innerHTML = '<p>Product not found.</p>';
      return;
    }

    const product = await fetchProductById(productId);

    if (!product || !product.id) {
      console.error('Invalid product data:', product);
      productContainer.innerHTML = '<p>Product details unavailable.</p>';
      return;
    }

    const { title, description, media, endsAt, _count } = product;

    productContainer.innerHTML = `
      <div class="container">
        <h1 class="text-center">${title}</h1>
        <img src="${media?.[0]?.url || 'default-image.jpg'}" alt="${media?.[0]?.alt || 'No description'}" class="img-fluid mx-auto d-block my-4" />
        <p>${description || 'No description available.'}</p>
        <p><strong>Ends at:</strong> ${new Date(endsAt).toLocaleString()}</p>
        <p class="bids-display" style="font-size: 1.5rem; font-weight: bold;">
          <strong>Bids:</strong> <span class="bids-count">${_count?.bids || 0}</span>
        </p>
      </div>
    `;
  } catch (error) {
    console.error('Error rendering product details:', error);
    productContainer.innerHTML =
      '<p>Error loading product details. Please try again later.</p>';
  }
}

export async function setupBidForm(productId) {
  const bidForm = document.getElementById('bidForm');
  if (!bidForm) {
    console.error('Bid form not found');
    return;
  }

  let highestBid = 0;
  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}/${productId}?_bids=true`
    );
    const product = await response.json();

    const bids = product.data?.bids || [];
    highestBid = bids.length ? Math.max(...bids.map((bid) => bid.amount)) : 0;
  } catch (error) {
    console.error('Error fetching product bids:', error);
  }

  bidForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const bidAmount = parseFloat(
      document.getElementById('bidAmount').value.trim()
    );
    if (!bidAmount || isNaN(bidAmount)) {
      alert('Please enter a valid bid amount.');
      return;
    }

    if (bidAmount <= highestBid) {
      alert(
        `Your bid must be higher than the current highest bid: ${highestBid} points.`
      );
      return;
    }

    try {
      await addBid(productId, bidAmount);
      alert('Bid added successfully!');
      document.querySelector('.bids-count').textContent =
        parseInt(document.querySelector('.bids-count').textContent) + 1;
      highestBid = bidAmount;
      await renderBids(productId);
    } catch (error) {
      console.error('Error adding bid:', error);
      alert('Failed to add bid. Please try again.');
    }
  });
}

export async function renderBids(productId) {
  const bidsContainer = document.getElementById('bids-container');
  if (!bidsContainer) {
    console.error('Bids container not found');
    return;
  }

  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}/${productId}?_bids=true`
    );
    const product = await response.json();

    const bids = product.data?.bids || [];
    if (bids.length === 0) {
      bidsContainer.innerHTML =
        '<p class="text-center">No bids available for this product.</p>';
      return;
    }

    bidsContainer.innerHTML = `
      <h3 class="mt-4">Bids</h3>
      <ul class="list-group">
        ${bids
          .map(
            (bid) =>
              `<li class="list-group-item">
                <div><strong>Amount:</strong> ${bid.amount} points</div>
                <div><strong>Bidder:</strong> ${bid.bidder?.name || 'Anonymous'}</div>
                <div><small>Placed on: ${new Date(bid.created).toLocaleString()}</small></div>
              </li>`
          )
          .join('')}
      </ul>
    `;
  } catch (error) {
    console.error('Error fetching bids:', error);
    bidsContainer.innerHTML =
      '<p class="text-center">Error loading bids. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateNavigation();
  const productId = new URLSearchParams(window.location.search).get('id');
  if (productId) {
    await renderProductDetails();
    await setupBidForm(productId);
    await renderBids(productId);
  }
});
