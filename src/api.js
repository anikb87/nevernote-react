// src/api.js

const isLocal = window.location.hostname === "localhost";

const API_BASE_URL = isLocal
  ? "http://localhost:3000" // Local backend
  : "https://nevernote-backend.onrender.com"; // Live backend

let mockNotes = [
  {
    id: "1",
    title: "Sample Note",
    content: "<p>This is a sample note.</p>",
  },
];

export async function getNotes() {
  if (isLocal) {
    return Promise.resolve(mockNotes);
  }
  const response = await fetch(`${API_BASE_URL}/notes`, { credentials: "include" });
  return response.json();
}

export async function createNote(note) {
  if (isLocal) {
    const newNote = { ...note, id: Date.now().toString() };
    mockNotes.push(newNote);
    return Promise.resolve(newNote);
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
    mockNotes = mockNotes.map((n) => (n.id === id ? { ...n, ...note } : n));
    return Promise.resolve(note);
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
    mockNotes = mockNotes.filter((n) => n.id !== id);
    return Promise.resolve({ message: "Note deleted" });
  }
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
}
