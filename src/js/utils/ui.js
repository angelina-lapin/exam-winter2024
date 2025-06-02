export function showLoadingIndicator() {
  document.getElementById("loading").classList.remove("hidden");
}

export function hideLoadingIndicator() {
  document.getElementById("loading").classList.add("hidden");
}

export function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
