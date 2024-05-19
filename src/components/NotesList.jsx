import React from 'react';
import NoteItem from './NoteItem';

const NotesList = ({ notes, onDeleteNote, onEditNote, onJumpToTimestamp }) => {
  return (
    <div className="p-4 border border-black m-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">My notes</h2>
      <p className="text-sm text-gray-500 mb-4">
        All your notes at a single place. Click on any note to go to specific timestamp in the video.
      </p>
      {notes.map(note => (
        <NoteItem
          key={note.timestamp}
          note={note}
          onDeleteNote={onDeleteNote}
          onEditNote={onEditNote}
          onJumpToTimestamp={onJumpToTimestamp}
        />
      ))}
    </div>
  );
};

export default NotesList;
