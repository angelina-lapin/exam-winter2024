import { API_AUTH_REGISTER } from "../modules/constants.js";

export async function register({ name, email, password }) {
  try {
    const requestBody = {
      name,
      email,
      password,
    };

    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.errors && errorData.errors.length > 0) {
        errorData.errors.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err.message || err);
        });
      }
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error during registration (catch block):", error.message);
    throw error;
  }
}
