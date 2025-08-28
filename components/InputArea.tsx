import React from 'react';
import Spinner from './Spinner';

interface InputAreaProps {
  onAnalysis: (prompt: string, image?: string) => void;
  isLoading: boolean;
}

const InputArea = ({ onAnalysis, isLoading }: InputAreaProps) => {
  const handleAnalyzeClick = () => {
    onAnalysis("Identifiziere diese Komponente");
  };

  return (
    <section style={styles.container} aria-labelledby="input-heading">
      <h2 id="input-heading" style={styles.heading}>Eingabe</h2>
      <div style={styles.inputMethods}>
        {/* Platzhalter für Tabs: Text, Datei, Kamera */}
        <p>Eingabemethoden (Text, Datei, Kamera) werden hier erscheinen.</p>
      </div>
      <button 
        style={styles.button} 
        onClick={handleAnalyzeClick} 
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? <Spinner /> : 'Analysieren'}
      </button>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--foreground-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    color: 'var(--secondary-color)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  inputMethods: {
    flexGrow: 1,
    minHeight: '100px',
  },
  button: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'var(--font-family)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default InputArea;