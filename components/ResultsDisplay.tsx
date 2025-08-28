import React from 'react';
import { AnalysisResult } from '../types';
import Spinner from './Spinner';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsDisplay = ({ result, isLoading, error }: ResultsDisplayProps) => {
  return (
    <section style={styles.container} aria-labelledby="results-heading">
      <h2 id="results-heading" style={styles.heading}>Analyseergebnis</h2>
      <div style={styles.content}>
        {isLoading && <div style={styles.centered}><Spinner size={48} /><p>Analysiere...</p></div>}
        {error && <p style={{ color: 'var(--danger-color)' }}>Fehler: {error}</p>}
        {result && !isLoading && (
          <div>
            <h3>{result.componentName}</h3>
            <p>{result.description}</p>
            {/* Weitere Details werden hier angezeigt */}
          </div>
        )}
        {!result && !isLoading && !error && (
          <p style={styles.placeholder}>Ergebnisse werden hier angezeigt.</p>
        )}
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
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '1rem', // Platz für Scrollbar
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: '1rem'
  },
  placeholder: {
    color: 'var(--border-color)',
  }
};

export default ResultsDisplay;