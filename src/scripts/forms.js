import { register } from "../js/api/register.js";
import { login } from "../js/api/login.js";

document.addEventListener("DOMContentLoaded", () => {
  const alertContainer = document.getElementById("alert-container");
  const successMessage = localStorage.getItem("successMessage");

  if (successMessage && alertContainer) {
    const alert = document.createElement("div");
    alert.className = "alert alert-success";
    alert.role = "alert";
    alert.textContent = successMessage;

    alertContainer.appendChild(alert);

    localStorage.removeItem("successMessage");
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        await register({ name, email, password });

        console.log("User registered successfully!");

        localStorage.setItem(
          "successMessage",
          "Registration successful! You can now log in."
        );

        window.location.href = "../pages/login.html";
      } catch (error) {
        console.error("Registration failed:", error.message);

        if (alertContainer) {
          const alert = document.createElement("div");
          alert.className = "alert alert-danger";
          alert.role = "alert";
          alert.textContent = `Registration failed: ${error.message}`;

          alertContainer.innerHTML = "";
          alertContainer.appendChild(alert);
        }
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const userData = await login({ email, password });
        console.log("Login successful:", userData);

        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Login successful!");
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Login error:", error);

        if (alertContainer) {
          const alert = document.createElement("div");
          alert.className = "alert alert-danger";
          alert.role = "alert";
          alert.textContent = `Login failed: ${error.message}`;

          alertContainer.innerHTML = "";
          alertContainer.appendChild(alert);
        }
      }
    });
  }
});
