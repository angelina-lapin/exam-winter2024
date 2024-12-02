import { API_KEY } from './constants.js';

export function headers() {
  const token = localStorage.getItem('token');
  const headers = new Headers();

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  }

  headers.append('Content-Type', 'application/json');

  return headers;
}
