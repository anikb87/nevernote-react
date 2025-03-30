// src/api.js

const isLocal = window.location.hostname === "localhost";

const API_BASE_URL = isLocal
  ? "http://localhost:3000" // Local backend
  : "https://nevernote-express.onrender.com"; // Live backend

export async function getNotes() {
  if (isLocal) {
    // Return empty array on startup
    return Promise.resolve([]);
  }
  const response = await fetch(`${API_BASE_URL}/notes`, { credentials: "include" });
  return response.json();
}

export async function createNote(note) {
  if (isLocal) {
    // Return new note object
    return Promise.resolve({ ...note, id: Date.now().toString() });
  }
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
    credentials: "include",
  });
  return response.json();
}

export async function updateNote(id, note) {
  if (isLocal) {
    return Promise.resolve({ id, ...note });
  }
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
    credentials: "include",
  });
  return response.json();
}

export async function deleteNote(id) {
  if (isLocal) {
    return Promise.resolve({ message: "Note deleted" });
  }
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
}
