const isMock = process.env.NODE_ENV === 'development';

// Local mock array
let mockNotes = [
  {
    _id: '1',
    title: 'Sample Note',
    content: '<p>This is a mock note.</p>',
  }
];

export const fetchNotes = async () => {
  if (isMock) {
    return Promise.resolve([...mockNotes]); // return a copy
  }
  const res = await fetch('/api/notes');
  return await res.json();
};

export const createNote = async (note) => {
  if (isMock) {
    const newNote = {
      ...note,
      _id: Date.now().toString(),
    };
    mockNotes.push(newNote); // ✅ only push here, not inside frontend too
    return Promise.resolve(newNote);
  }

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return await res.json();
};

export const updateNote = async (id, content) => {
  if (isMock) {
    const index = mockNotes.findIndex((n) => n._id === id);
    if (index !== -1) {
      mockNotes[index].content = content;
      return Promise.resolve({ ...mockNotes[index] });
    }
    return Promise.reject('Note not found');
  }

  const res = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return await res.json();
};

export const deleteNote = async (id) => {
  if (isMock) {
    mockNotes = mockNotes.filter((n) => n._id !== id);
    return Promise.resolve({ message: 'Note deleted' });
  }

  const res = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
