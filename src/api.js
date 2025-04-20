// src/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getNotes() {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createNote(note) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function updateNote(id, content) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}
