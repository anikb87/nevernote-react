import React from 'react';
import NoteItem from '../NoteItem/NoteItem';
import './NoteList.css';

const NoteList = ({
  notes,
  expandedNoteIndex,
  onExpand,
  onEdit,
  onDelete,
}) => {
  if (notes.length === 0) {
    return <p className="no-notes-message">No Notes!</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note, index) => (
        <NoteItem
          key={note._id || index}
          note={note}
          index={index}
          isActive={expandedNoteIndex === index}
          onExpand={onExpand}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default NoteList;
