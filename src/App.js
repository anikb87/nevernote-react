import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import NoteList from './components/NoteList/NoteList';
import NoteEditor from './components/NoteEditor/NoteEditor';

function App() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await getNotes();
      setNotes(data);
    };
    load();
  }, []);

  useEffect(() => {
    if (editingIndex !== null && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingIndex]);

  const handleAddOrSave = async () => {
    if (!title.trim() || !note.trim()) return;

    if (editingIndex !== null) {
      const updated = await updateNote(notes[editingIndex]._id, note);
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = {
        ...updatedNotes[editingIndex],
        content: updated.content,
        title,
      };
      setNotes(updatedNotes);
      setEditingIndex(null);
    } else {
      const created = await createNote({ title, content: note });
      setNotes((prev) => [...prev, created]);
    }

    setTitle('');
    setNote('');
  };

  const handleEdit = (index) => {
    setTitle(notes[index].title);
    setNote(notes[index].content);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setNote('');
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    await deleteNote(notes[index]._id);
    const filtered = notes.filter((_, i) => i !== index);
    setNotes(filtered);
    if (expandedNoteIndex === index) setExpandedNoteIndex(null);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="notes-container">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {filteredNotes.length === 0 ? (
            <p className="no-notes-message">No Notes!</p>
          ) : (
            <NoteList
              notes={filteredNotes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandedIndex={expandedNoteIndex}
              setExpandedIndex={setExpandedNoteIndex}
            />
          )}
        </div>

        <NoteEditor
          title={title}
          setTitle={setTitle}
          note={note}
          setNote={setNote}
          handleAddOrSave={handleAddOrSave}
          handleCancelEdit={handleCancelEdit}
          editingIndex={editingIndex}
          titleInputRef={titleInputRef}
        />
      </div>
    </div>
  );
}

export default App;
