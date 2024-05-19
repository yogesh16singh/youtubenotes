import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNote = ({ currentTimestamp, onAddNote,notes }) => {
  const [noteContent, setNoteContent] = useState('');
  const [noteImage, setNoteImage] = useState('');

  const handleAddNote = () => {
    if (noteContent.trim() || noteImage ) {
      onAddNote({
        timestamp: currentTimestamp,
        content: noteContent,
        image: noteImage,
        date: Date.now(),
      });
      
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNoteImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
   useEffect(()=>{
    setNoteContent('');
    setNoteImage('');
   },[notes])
  return (
    <div className="flex flex-col space-y-4 m-4 shadow-sm p-4 border border-black rounded-lg">
      <ReactQuill value={noteContent} onChange={setNoteContent} />
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
      <button
        className="self-end px-8 py-2 bg-blue-700 text-white rounded"
        onClick={handleAddNote}
      >
        Add Note
      </button>
    </div>
  );
};

export default AddNote;
