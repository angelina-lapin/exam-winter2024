import { API_AUCTION_LISTINGS, API_BASE } from '../js/constants.js';
import { headers } from '../js/headers.js';

export async function fetchAuctions(page = 1, limit = 50) {
  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}?_sort=createdAt&_order=desc&_page=${page}&_limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    const data = await response.json();

    const items = Array.isArray(data.data) ? data.data : [];
    const totalCount = parseInt(response.headers.get('X-Total-Count'), 10) || 0;

    return { items, totalCount };
  } catch (error) {
    console.error('Error during fetchAuctions:', error);
    return { items: [], totalCount: 0 };
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

export async function fetchUserProfile(name) {
  try {
    const response = await fetch(`${API_BASE}/auction/profiles/${name}`, {
      headers: headers(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(profileUpdates) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.data?.name) {
    console.error('User not logged in or missing profile name');
    return;
  }
  const profileName = [user.data.name];

  try {
    const response = await fetch(
      `${API_BASE}/auction/profiles/${profileName}`,
      {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(profileUpdates),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function createListing(data) {
  try {
    const response = await fetch(API_AUCTION_LISTINGS, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}

export async function fetchUserListings(userName) {
  try {
    const response = await fetch(
      `${API_BASE}/auction/profiles/${userName}/listings`,
      {
        headers: headers(),
      }
    );

    if (!response.ok) throw new Error('Failed to fetch user listings');

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }
}

export async function deleteListing(listingId) {
  try {
    const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}`, {
      method: 'DELETE',
      headers: headers(),
    });

    if (response.status !== 204) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete listing');
    }

    console.log(`Listing ${listingId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
}
