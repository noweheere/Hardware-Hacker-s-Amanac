import React from 'react';

const ProjectActions = () => {
  return (
    <section style={styles.container} aria-labelledby="actions-heading">
      <h2 id="actions-heading" style={styles.heading}>Projekt</h2>
      <div style={styles.buttonGroup}>
        <button style={styles.button}>Speichern</button>
        <button style={styles.button}>Laden</button>
        <button style={styles.button}>Als PDF exportieren</button>
      </div>
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
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    flex: 1,
    backgroundColor: 'var(--border-color)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
};

export default ProjectActions;