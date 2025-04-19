import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import NoteList from '../NoteList/NoteList';
import NoteEditor from '../NoteEditor/NoteEditor';

import { getNotes, createNote, updateNote, deleteNote } from '../../api';

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
      setExpandedNoteIndex(null); // collapse on load
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
      const updated = await updateNote(notes[editingIndex]._id, { title, content: note });
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = updated;
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

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="notes-container">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {filteredNotes.length === 0 ? (
            <p className="no-notes-message">No Notes!</p>
          ) : (
            <NoteList
              notes={filteredNotes}
              expandedNoteIndex={expandedNoteIndex}
              setExpandedNoteIndex={setExpandedNoteIndex}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>

        <NoteEditor
          title={title}
          note={note}
          setTitle={setTitle}
          setNote={setNote}
          titleInputRef={titleInputRef}
          handleAddOrSave={handleAddOrSave}
          editingIndex={editingIndex}
          handleCancelEdit={handleCancelEdit}
        />
      </div>
    </div>
  );
}

export default App;
