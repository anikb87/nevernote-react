// src/api.js

const isLocal = window.location.hostname === "localhost";

const API_BASE_URL = isLocal
  ? "http://localhost:3000"
  : "https://nevernote-express.onrender.com";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ---------------- AUTH ----------------

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    return response.json(); // Should contain the token
  } catch (error) {
    console.error("Error during loginUser:", error);
    throw error;
  }
}

// ---------------- NOTES ----------------

export async function getNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    return response.json();
  } catch (error) {
    console.error("Error during getNotes:", error);
    throw error;
  }
}

export async function createNote(note) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    return response.json();
  } catch (error) {
    console.error("Error during createNote:", error);
    throw error;
  }
}

export async function updateNote(id, updatedFields) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error("Failed to update note");
    }

    return response.json();
  } catch (error) {
    console.error("Error during updateNote:", error);
    throw error;
  }
}

export async function deleteNote(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }

    return response.json();
  } catch (error) {
    console.error("Error during deleteNote:", error);
    throw error;
  }
}
