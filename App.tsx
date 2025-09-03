import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultsDisplay from './components/ResultsDisplay';
import NotesSection from './components/NotesSection';
import ProjectActions from './components/ProjectActions';
import Instructions from './components/Instructions';
import { AnalysisResult, AppState } from './types';
import { analyzeComponent } from './services/geminiService';

const App = () => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    error: null,
    analysisResult: null,
    notes: '',
  });

  const handleAnalysis = async (prompt: string, image?: string) => {
    if (!image) {
      setAppState(prev => ({ ...prev, error: "Kein Bild zum Analysieren vorhanden." }));
      return;
    }

    console.log('Analyse gestartet', { prompt });
    setAppState(prev => ({ ...prev, isLoading: true, error: null, analysisResult: null }));
    
    try {
      const result = await analyzeComponent(prompt, image);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        analysisResult: result,
      }));
    } catch (err) {
      const error = err as Error;
      console.error(error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
      }));
    }
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