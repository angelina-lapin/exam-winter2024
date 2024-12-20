import { API_KEY } from "./constants.js";

export function headers() {
  const user = localStorage.getItem("user");
  let token = null;

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      token = parsedUser.data?.accessToken || null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }

  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.warn("No authorization token found.");
  }

  if (API_KEY) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }

  headers.set("Content-Type", "application/json");

  return headers;
}
