import { API_AUCTION_LISTINGS } from '../js/constants.js';

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
