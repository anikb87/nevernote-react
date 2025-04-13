import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import { useNavigate } from 'react-router-dom';

function App() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const titleInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
        setExpandedNoteIndex(null); // Collapse any note on fresh load
      } catch (err) {
        console.error('Failed to load notes:', err);
      }
    };
    loadNotes();
  }, []);

  const handleAddOrSave = async () => {
    if (!title.trim() || !note.trim()) return;

    if (editingIndex !== null) {
      const updated = await updateNote(notes[editingIndex]._id, { title, content: note });
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = { ...updatedNotes[editingIndex], title: updated.title, content: updated.content };
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
    titleInputRef.current?.focus();
  };

  const handleDelete = async (index) => {
    await deleteNote(notes[index]._id);
    setNotes((prev) => prev.filter((_, i) => i !== index));
    if (expandedNoteIndex === index) setExpandedNoteIndex(null);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setNote('');
    setEditingIndex(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="app-header">
        <h1 className="app-title">NeverNote</h1>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="App">
        <div className="container">
          <div className="notes-container">
            <div className="search-bar-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search Notes..."
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
                {filteredNotes.map((n, index) => (
                  <li
                    key={n._id}
                    className={`note-item ${expandedNoteIndex === index ? 'active-note' : ''}`}
                  >
                    <div
                      className="note-header clickable"
                      onClick={() => setExpandedNoteIndex(index === expandedNoteIndex ? null : index)}
                    >
                      <span className="note-title">{n.title}</span>
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
                        <p dangerouslySetInnerHTML={{ __html: n.content }} />
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
    </>
  );
}

export default App;
