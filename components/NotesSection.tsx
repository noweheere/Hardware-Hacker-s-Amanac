
import React from 'react';

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, setNotes }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h2 className="text-xl font-bold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-2">Project Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="> Start typing your project notes here... Saved automatically."
        className="w-full h-64 bg-gray-900 text-green-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y transition-all duration-300"
      />
      <p className="text-xs text-gray-500 mt-2">Notes are saved to your browser's local storage.</p>
    </div>
  );
};

export default NotesSection;
