const isLocal = window.location.hostname === "localhost";

const API_BASE_URL = isLocal
  ? "http://localhost:3000" // Local backend
  : "https://nevernote-express.onrender.com"; // Deployed backend

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getNotes() {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export async function createNote(note) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return response.json();
}

export async function updateNote(id, note) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  return response.json();
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}
