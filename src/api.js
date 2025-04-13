const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://nevernote-express.onrender.com';

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function getNotes(token) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to get notes');
  return response.json();
}

export async function createNote(note, token) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create note');
  return response.json();
}

export async function updateNote(id, note, token) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update note');
  return response.json();
}

export async function deleteNote(id, token) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete note');
  return response.json();
}
