import React, { useState } from 'react';
import { X, Pencil, Trash2, Save } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import Button from './ui/Button';
import Input from './ui/Input';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ isOpen, onClose }) => {
  const { notes, updateNote, deleteNote } = useStudy();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  if (!isOpen) return null;

  const handleEditClick = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditedContent(content);
  };

  const handleSaveClick = () => {
    if (editingNoteId) {
      updateNote(editingNoteId, editedContent);
      setEditingNoteId(null);
    }
  };

  const handleDeleteClick = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-lg z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Notes</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-4">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>You haven't added any notes yet.</p>
            <p className="mt-2">Click the "Add Note" button when studying to create your first note.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    {editingNoteId === note.id ? (
                      <>
                        <button
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={handleSaveClick}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditClick(note.id, note.content)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(note.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {editingNoteId === note.id ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                        dark:bg-gray-700 dark:text-white
                        focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {note.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;