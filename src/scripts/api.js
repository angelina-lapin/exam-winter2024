const API_URL = 'https://api.noroff.dev/api/v1/auction/listings';

export async function fetchAuctions() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch listings');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
