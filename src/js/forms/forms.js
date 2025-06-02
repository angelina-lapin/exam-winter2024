import { register } from "../api/register.js";
import { login } from "../api/login.js";
import { showToast } from "../utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const alertContainer = document.getElementById("alert-container");
  const successMessage = localStorage.getItem("successMessage");

  if (successMessage && alertContainer) {
    showToast(successMessage);
    localStorage.removeItem("successMessage");
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name || !email || !password) {
        showToast("Please fill in all fields.");
        return;
      }

      try {
        await register({ name, email, password });

        localStorage.setItem(
          "successMessage",
          "Registration successful! You can now log in."
        );

        window.location.href = "../pages/login.html";
      } catch (error) {
        showToast(`Registration failed: ${error.message}`);
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        showToast("Please fill in both email and password.");
        return;
      }

      try {
        const userData = await login({ email, password });

        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));

        showToast("Login successful!");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1000);
      } catch (error) {
        showToast(`Login failed: ${error.message}`);
      }
    });
  }
});
