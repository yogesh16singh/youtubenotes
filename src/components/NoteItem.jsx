import React from 'react';
import ReactQuill from 'react-quill';

const NoteItem = ({ note, onDeleteNote, onEditNote, onJumpToTimestamp }) => {
  const { timestamp, content, image, date } = note;

  return (
    <div className="p-4 border-b-2 border-black  shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => onJumpToTimestamp(timestamp)}
        >
          {new Date(timestamp * 1000).toISOString().substr(11, 8)}
        </span>
        <span className="text-gray-500 text-sm">{new Date(date).toLocaleString()}</span>
      </div>
      <ReactQuill value={content} onChange={value => onEditNote(date, value)} readOnly={false} theme="snow" />
      {image && <img src={image} alt="Note" className="mt-2 max-w-full h-auto" />}
      <div className="flex justify-end space-x-2 mt-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => onDeleteNote(date)}
        >
          Delete note
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
