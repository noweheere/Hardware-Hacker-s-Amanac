import React from 'react';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSection = ({ notes, onNotesChange }: NotesSectionProps) => {
  return (
    <section style={styles.container} aria-labelledby="notes-heading">
      <h2 id="notes-heading" style={styles.heading}>Projektnotizen</h2>
      <textarea
        style={styles.textarea}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Deine Notizen hier..."
        aria-label="Projektnotizen"
      />
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--foreground-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  heading: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: 'var(--secondary-color)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  textarea: {
    flexGrow: 1,
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    padding: '0.5rem',
    fontFamily: 'var(--font-family)',
    resize: 'none',
  },
};

export default NotesSection;