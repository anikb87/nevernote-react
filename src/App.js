import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from './api';

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
      const updated = await updateNote(notes[editingIndex].id, { content: note, title });
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = { ...updatedNotes[editingIndex], content: updated.content, title };
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
    await deleteNote(notes[index].id);
    const filtered = notes.filter((_, i) => i !== index);
    setNotes(filtered);
    if (expandedNoteIndex === index) setExpandedNoteIndex(null);
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('nevernote-user');
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">NeverNote</h1>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="container">
        <div className="notes-container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search Notes..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <AiOutlineClose className="clear-search" onClick={() => setSearchQuery('')} />
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <p className="no-notes-message">No Notes!</p>
          ) : (
            <ul>
              {filteredNotes.map((note, index) => (
                <li key={note.id || index} className={`note-item ${expandedNoteIndex === index ? 'active-note' : ''}`}>
                  <div
                    className="note-header clickable"
                    onClick={() =>
                      setExpandedNoteIndex(expandedNoteIndex === index ? null : index)
                    }
                  >
                    <span className="note-title">{note.title}</span>
                    <div className="note-buttons">
                      <AiOutlineEdit
                        className="edit-note-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                      />
                      <AiOutlineDelete
                        className="trash-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      />
                    </div>
                  </div>
                  {expandedNoteIndex === index && (
                    <div className="note-content-preview">
                      <p dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-container">
          <input
            id="note-title"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-title-input"
            placeholder="Enter the title"
          />
          <div className="rich-text-wrapper">
            <ReactQuill
              value={note}
              onChange={setNote}
              placeholder="Enter your note content"
            />
          </div>
          <div className="button-row">
            <button className="add-note-btn" onClick={handleAddOrSave}>
              {editingIndex !== null ? 'Save Changes' : 'Add Note'}
            </button>
            {editingIndex !== null && (
              <button className="cancel-edit-btn" onClick={handleCancelEdit}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
