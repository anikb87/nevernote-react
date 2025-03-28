import React, { useState, useEffect } from "react";
import "./App.css";
import { getNotes, createNote, updateNote, deleteNote } from "./api";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      const data = await getNotes();
      setNotes(data);
    }
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (title.trim() && note.trim()) {
      const newNote = await createNote({ title, content: note });
      setNotes([...notes, newNote]);
      setTitle("");
      setNote("");
    }
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id && n._id !== id));
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditContent(notes[index].content);
    setExpandedIndex(index);
  };

  const handleSaveEdit = async (index) => {
    const noteToEdit = notes[index];
    const updated = await updateNote(noteToEdit.id || noteToEdit._id, {
      title: noteToEdit.title,
      content: editContent,
    });
    const updatedNotes = [...notes];
    updatedNotes[index].content = updated.content;
    setNotes(updatedNotes);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="notes-container">
          {notes.length === 0 ? (
            <p className="no-notes-message">No Notes!</p>
          ) : (
            <ul>
              {notes.map((note, index) => (
                <li
                  key={note.id || note._id}
                  className="note-item"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="note-header">
                    <span className="note-title">{note.title}</span>
                    <div className="note-buttons">
                      <FaEdit
                        className="edit-note-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(index);
                        }}
                      />
                      <FaTrash
                        className="remove-note-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id || note._id);
                        }}
                      />
                    </div>
                  </div>
                  {expandedIndex === index && (
                    <div className="note-content">
                      {editingIndex === index ? (
                        <>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="edit-buttons">
                            <button
                              className="save-note-btn"
                              onClick={() => handleSaveEdit(index)}
                            >
                              Save Changes
                            </button>
                            <button
                              className="cancel-edit-btn"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="note-title-input"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="note-textarea"
          />
          <button className="add-note-btn" onClick={handleAddNote}>
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
