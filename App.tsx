import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultsDisplay from './components/ResultsDisplay';
import NotesSection from './components/NotesSection';
import ProjectActions from './components/ProjectActions';
import Instructions from './components/Instructions';
import { AnalysisResult, AppState } from './types';

const App = () => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    error: null,
    analysisResult: null,
    notes: '',
  });

  const handleAnalysis = async (prompt: string, image?: string) => {
    // Platzhalter für die API-Aufruffunktion
    console.log('Analyse gestartet', { prompt, image: image?.substring(0, 30) });
    setAppState(prev => ({ ...prev, isLoading: true, error: null, analysisResult: null }));
    // Simuliert einen API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAppState(prev => ({
      ...prev,
      isLoading: false,
      analysisResult: {
        componentName: 'Beispiel-Chip',
        description: 'Dies ist ein Platzhalter für die Komponentendetails.',
        specifications: { 'Spannung': '3.3V', 'Taktfrequenz': '16MHz' },
        datasheetUrl: 'https://example.com/datasheet.pdf',
        hackingGuide: 'Schritt 1: ...',
        recommendedTools: ['Lötkolben', 'Multimeter'],
        communityLinks: ['https://forum.example.com']
      }
    }));
  };

  const handleNotesChange = (notes: string) => {
    setAppState(prev => ({ ...prev, notes }));
  };

  return (
    <div style={styles.app}>
      <Header />
      <main style={styles.main}>
        <div style={styles.leftPanel}>
          <InputArea onAnalysis={handleAnalysis} isLoading={appState.isLoading} />
          <ResultsDisplay 
            result={appState.analysisResult} 
            isLoading={appState.isLoading} 
            error={appState.error} 
          />
        </div>
        <div style={styles.rightPanel}>
          <ProjectActions />
          <NotesSection notes={appState.notes} onNotesChange={handleNotesChange} />
          <Instructions />
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    flexGrow: 1,
    gap: '1rem',
    padding: '1rem',
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflow: 'hidden',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflow: 'hidden',
  },
};

export default App;