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
import Login from './Login';

function App() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (token) {
      const fetchNotes = async () => {
        try {
          const data = await getNotes(token);
          setNotes(data);
        } catch (err) {
          console.error('Error fetching notes:', err);
        }
      };
      fetchNotes();
    }
  }, [token]);

  useEffect(() => {
    if (editingIndex !== null && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingIndex]);

  const handleAddOrSave = async () => {
    if (!title.trim() || !note.trim()) return;

    try {
      if (editingIndex !== null) {
        const updated = await updateNote(notes[editingIndex]._id, { title, content: note }, token);
        const updatedNotes = [...notes];
        updatedNotes[editingIndex] = updated;
        setNotes(updatedNotes);
        setEditingIndex(null);
      } else {
        const created = await createNote({ title, content: note }, token);
        setNotes((prev) => [...prev, created]);
      }
      setTitle('');
      setNote('');
    } catch (err) {
      console.error('Save error:', err);
    }
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
    try {
      await deleteNote(notes[index]._id, token);
      const updated = notes.filter((_, i) => i !== index);
      setNotes(updated);
      if (expandedNoteIndex === index) setExpandedNoteIndex(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token) return <Login setToken={setToken} />;

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">NeverNote</h1>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

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
              <AiOutlineClose
                className="clear-search"
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <p className="no-notes-message">No Notes!</p>
          ) : (
            <ul>
              {filteredNotes.map((note, index) => (
                <li
                  key={note._id}
                  className={`note-item ${expandedNoteIndex === index ? 'active-note' : ''}`}
                >
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
                      <p
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
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
