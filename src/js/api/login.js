import { API_AUTH_LOGIN } from "../modules/constants.js";
import {
  showLoadingIndicator,
  hideLoadingIndicator,
  showToast,
} from "../utils/ui.js";

export async function login(credentials) {
  showLoadingIndicator();
  try {
    const response = await fetch(`${API_AUTH_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    showToast("Login successful!");
    return data;
  } catch (error) {
    showToast(error.message);
    console.error(error);
    return null;
  } finally {
    hideLoadingIndicator();
  }
}
