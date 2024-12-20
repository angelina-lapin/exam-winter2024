import { API_AUTH_REGISTER } from "../modules/constants.js";

export async function register({ name, email, password }) {
  console.log("Register function called");

  try {
    const requestBody = {
      name,
      email,
      password,
    };

    console.log("Request body:", requestBody);

    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Request URL:", API_AUTH_REGISTER);
    console.log("Request Headers:", { "Content-Type": "application/json" });
    console.log("Request Body (JSON):", JSON.stringify(requestBody));
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Response not OK:", response);
      console.log("Response error body:", errorData);

      if (errorData.errors && errorData.errors.length > 0) {
        errorData.errors.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err.message || err);
        });
      }
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error("Error during registration (catch block):", error.message);
    throw error;
  }
}
