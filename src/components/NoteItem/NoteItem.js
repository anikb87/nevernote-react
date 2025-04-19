import React from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import './NoteItem.css';

const NoteItem = ({ note, index, isActive, onExpand, onEdit, onDelete }) => {
  return (
    <li
      className={`note-item ${isActive ? 'active-note' : ''}`}
      onClick={() => onExpand(index)}
    >
      <div className="note-header">
        <span className="note-title">{note.title}</span>
        <div className="note-buttons">
          <AiOutlineEdit
            className="edit-note-icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(index);
            }}
          />
          <AiOutlineDelete
            className="trash-icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
          />
        </div>
      </div>
      {isActive && (
        <div className="note-content-preview">
          <p dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      )}
    </li>
  );
};

export default NoteItem;
