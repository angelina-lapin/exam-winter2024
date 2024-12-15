import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserListings,
  createListing,
  deleteListing,
} from "./api.js";
import { updateNavigation } from "./main.js";

async function renderProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.data?.name) {
    console.error("User not logged in or missing profile name");
    return;
  }

  const profileData = await fetchUserProfile(user.data.name);
  if (!profileData || !profileData.data) {
    console.error("Failed to load profile data");
    return;
  }

  const { name, email, avatar, banner, credits, bio, _count } =
    profileData.data;

  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-email").textContent = email;
  document.getElementById("profile-credit").textContent = credits || 0;
  document.getElementById("profile-avatar").src =
    avatar?.url || "default-avatar.jpg";
  document.getElementById("profile-banner-image").src =
    banner?.url || "default-banner.jpg";

  if (bio) {
    document.getElementById("profile-bio").textContent = bio;
  }

  document.getElementById("listings-count").textContent = _count.listings || 0;
  document.getElementById("wins-count").textContent = _count.wins || 0;
}

async function setupAvatarChange() {
  document
    .getElementById("changeAvatarBtn")
    .addEventListener("click", async () => {
      const newAvatarUrl = prompt("Enter the URL of your new avatar:");
      if (newAvatarUrl) {
        try {
          const updates = { avatar: { url: newAvatarUrl, alt: "User avatar" } };
          await updateUserProfile(updates);
          alert("Avatar updated successfully!");
          await renderProfile();
        } catch (error) {
          console.error("Error updating avatar:", error);
          alert("Failed to update avatar. Please try again.");
        }
      }
    });
}

async function setupBannerChange() {
  document
    .getElementById("changeBannerBtn")
    .addEventListener("click", async () => {
      const newBannerUrl = prompt("Enter the URL of your new banner:");
      if (newBannerUrl) {
        try {
          const updates = { banner: { url: newBannerUrl, alt: "User banner" } };
          await updateUserProfile(updates);
          alert("Banner updated successfully!");
          await renderProfile();
        } catch (error) {
          console.error("Error updating banner:", error);
          alert("Failed to update banner. Please try again.");
        }
      }
    });
}

async function setupCreateListingForm() {
  const createListingForm = document.getElementById("createListingForm");
  if (!createListingForm) {
    console.error("Create Listing form not found");
    return;
  }

  createListingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("listingTitle").value.trim();
    const description = document
      .getElementById("listingDescription")
      .value.trim();
    const media = document
      .getElementById("listingMedia")
      .value.split(",")
      .map((url) => ({ url: url.trim(), alt: "Media for listing" }))
      .filter((item) => item.url);
    const endsAt = new Date(
      document.getElementById("listingDeadline").value
    ).toISOString();

    if (!title || !endsAt) {
      alert("Title and deadline are required.");
      return;
    }

    const listingData = { title, description, media, endsAt };

    try {
      await createListing(listingData);
      alert("Listing created successfully!");
      createListingForm.reset();
      await renderUserListings();
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    }
  });
}

async function renderUserListings() {
  const userListingsContainer = document.getElementById("userListings");
  if (!userListingsContainer) {
    console.error("User listings container not found");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.data?.name) {
    console.error("User not logged in or missing profile name");
    return;
  }

  try {
    const listings = await fetchUserListings(user.data.name);

    if (listings.length === 0) {
      userListingsContainer.innerHTML =
        '<p class="text-center">No listings available. Create your first listing!</p>';
      return;
    }

    userListingsContainer.innerHTML = listings
      .map(
        (listing) => `
      <div class="col-md-4">
        <div class="card">
          <img src="${listing.media?.[0]?.url || "default-image.jpg"}" 
               class="card-img-top" 
               alt="${listing.media?.[0]?.alt || "Listing image"}">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${
              listing.description || "No description provided."
            }</p>
            <p><strong>Ends at:</strong> ${new Date(
              listing.endsAt
            ).toLocaleString()}</p>
            <button class="btn btn-danger btn-delete" data-id="${
              listing.id
            }">Delete</button>
            <a href="/src/pages/product.html?id=${
              listing.id
            }" class="btn btn-dark">View Details</a>
            
          </div>
        </div>
      </div>`
      )
      .join("");

    setupDeleteButtons();
    setupViewDetailsButtons();
  } catch (error) {
    console.error("Error fetching user listings:", error);
    userListingsContainer.innerHTML =
      '<p class="text-center">Error loading listings. Please try again later.</p>';
  }
}

function setupDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const listingId = event.target.dataset.id;
      if (confirm("Are you sure you want to delete this listing?")) {
        try {
          await deleteListing(listingId);
          alert("Listing deleted successfully!");
          await renderUserListings();
        } catch (error) {
          console.error("Failed to delete listing:", error);
          alert("Failed to delete listing. Please try again.");
        }
      }
    });
  });
}

function setupViewDetailsButtons() {
  document.querySelectorAll(".btn-view-details").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const listingId = event.target.dataset.id;
      if (listingId) {
        window.location.href = `/product.html?id=${listingId}`;
      } else {
        console.error("Listing ID not found.");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  updateNavigation();
  await renderProfile();
  await setupAvatarChange();
  await setupBannerChange();
  await setupCreateListingForm();
  await renderUserListings();
});
