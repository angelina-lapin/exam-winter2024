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
    console.log("Register form found");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Register form submitted");

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const userData = await register({ name, email, password });
        console.log("Registration successful:", userData);

        localStorage.setItem(
          "successMessage",
          "Registration successful! Please log in using your new account."
        );
        window.location.href = "./login.html";
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.message || "Registration failed");
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
        alert(error.message || "Login failed");
      }
    });
  }
});
