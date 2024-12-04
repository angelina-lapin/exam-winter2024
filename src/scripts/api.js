import { API_AUCTION_LISTINGS } from '../js/constants.js';
import { headers } from '../js/headers.js';

export async function fetchAuctions() {
  try {
    console.log(`Fetching from: ${API_AUCTION_LISTINGS}`);
    const response = await fetch(API_AUCTION_LISTINGS);
    if (!response.ok) throw new Error('Failed to fetch listings');
    return await response.json();
  } catch (error) {
    console.error('Error during fetchAuctions:', error);
    return [];
  }
}

export async function fetchProductById(id) {
  const url = `${API_AUCTION_LISTINGS}/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export async function searchListings(query) {
  try {
    const url = `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error during searchListings:', error);
    return [];
  }
}

export async function addBid(listingId, amount) {
  try {
    const headersObject = headers();
    if (!headersObject.has('Authorization')) {
      alert('You must be logged in to place a bid.');
      throw new Error('Authorization header missing.');
    }

    const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}/bids`, {
      method: 'POST',
      headers: headersObject,
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error('Failed to add bid');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding bid:', error);
    throw error;
  }
}

export async function fetchBids(listingId) {
  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}/${listingId}?_bids=true`
    );
    const product = await response.json();
    console.log('Product with bids:', data);
    console.log('Bids:', product.data.bids);

    if (!response.ok) throw new Error('Failed to fetch bids');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bids:', error);
    throw error;
  }
}
