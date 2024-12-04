import { fetchProductById } from './api.js';
import { isAuthenticated, updateNavigation } from './main.js';

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
    console.log('Fetched product:', product);

    if (!product || !product.title) {
      console.error('Invalid product data:', product);
      productContainer.innerHTML = '<p>Product details unavailable.</p>';
      return;
    }

    const { title, description, media, _count } = product;

    productContainer.innerHTML = `
      <div class="container">
        <h1 class="text-center">${title}</h1>
        <img src="${media?.[0]?.url || 'default-image.jpg'}" alt="${media?.[0]?.alt || 'No description'}" class="img-fluid mx-auto d-block my-4" />
        <p>${description || 'No description available.'}</p>
        <p><strong>Bids:</strong> ${_count?.bids || 0}</p>
      </div>
    `;
  } catch (error) {
    console.error('Error rendering product details:', error);
    productContainer.innerHTML =
      '<p>Error loading product details. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateNavigation();
  await renderProductDetails();
});
