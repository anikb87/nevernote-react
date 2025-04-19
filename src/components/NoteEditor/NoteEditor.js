import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NoteEditor.css';

const NoteEditor = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onAddOrSave,
  onCancelEdit,
  isEditing,
}) => {
  return (
    <div className="input-container">
      <input
        id="note-title"
        type="text"
        value={title}
        onChange={onTitleChange}
        className="note-title-input"
        placeholder="Enter the title"
      />
      <div className="rich-text-wrapper">
        <ReactQuill
          value={content}
          onChange={onContentChange}
          placeholder="Enter your note content"
        />
      </div>
      <div className="button-row">
        <button className="add-note-btn" onClick={onAddOrSave}>
          {isEditing ? 'Save Changes' : 'Add Note'}
        </button>
        {isEditing && (
          <button className="cancel-edit-btn" onClick={onCancelEdit}>Cancel</button>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
