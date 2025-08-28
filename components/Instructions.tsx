import React from 'react';

const Instructions = () => {
  return (
    <section style={styles.container} aria-labelledby="instructions-heading">
      <h2 id="instructions-heading" style={styles.heading}>Anleitung</h2>
      <ol style={styles.list}>
        <li>Wähle eine Eingabemethode (Text, Datei oder Kamera).</li>
        <li>Gib die Komponentendaten ein oder mache ein Foto.</li>
        <li>Klicke auf "Analysieren", um Details von der KI zu erhalten.</li>
        <li>Speichere deine Sitzung oder exportiere sie als PDF.</li>
      </ol>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--foreground-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem',
  },
  heading: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: 'var(--secondary-color)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  list: {
    margin: 0,
    paddingLeft: '1.5rem',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  }
};

export default Instructions;