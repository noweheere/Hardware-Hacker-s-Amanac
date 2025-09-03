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
          <div style={styles.resultDetails}>
            <h3 style={styles.resultTitle}>{result.componentName}</h3>
            <p>{result.description}</p>
            
            <h4 style={styles.subHeading}>Spezifikationen</h4>
            <ul style={styles.specList}>
              {Object.entries(result.specifications).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>

            <h4 style={styles.subHeading}>Ressourcen</h4>
            <a href={result.datasheetUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>Datenblatt ansehen</a>
            
            <h4 style={styles.subHeading}>Hacking Guide</h4>
            <p>{result.hackingGuide}</p>

            <h4 style={styles.subHeading}>Empfohlene Werkzeuge</h4>
            <ul style={styles.toolList}>
              {result.recommendedTools.map(tool => <li key={tool} style={styles.toolTag}>{tool}</li>)}
            </ul>

            <h4 style={styles.subHeading}>Community Links</h4>
            <ul style={styles.linkList}>
              {result.communityLinks.map(link => (
                <li key={link}>
                  <a href={link} target="_blank" rel="noopener noreferrer" style={styles.link}>{link}</a>
                </li>
              ))}
            </ul>
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
    paddingRight: '1rem',
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
  },
  resultDetails: {
    animation: 'fadeIn 0.5s ease-in-out',
  },
  resultTitle: {
      color: 'var(--primary-color)',
      margin: '0 0 0.5rem 0',
  },
  subHeading: {
      marginTop: '1.5rem',
      marginBottom: '0.5rem',
      color: 'var(--secondary-color)',
      borderBottom: '1px solid var(--border-color)',
      paddingBottom: '0.25rem',
      fontSize: '0.9rem',
      fontWeight: 'normal',
  },
  specList: {
      listStyle: 'none',
      padding: 0,
      fontSize: '0.9rem',
      lineHeight: 1.6,
  },
  link: {
      color: 'var(--primary-color)',
      textDecoration: 'none',
      wordBreak: 'break-all',
  },
  toolList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      listStyle: 'none',
      padding: 0,
      margin: 0,
  },
  toolTag: {
      backgroundColor: 'var(--border-color)',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
  },
  linkList: {
      listStyle: 'none',
      padding: 0,
      fontSize: '0.9rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
  }
};

export default ResultsDisplay;