
import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultsDisplay from './components/ResultsDisplay';
import NotesSection from './components/NotesSection';
import { AnalysisResult } from './types';
import { analyzeHardware } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notes, setNotes] = useLocalStorage<string>('hackingNotes', '');

  const handleAnalysis = async (textInput?: string, imageBase64?: string, mimeType?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeHardware(textInput, imageBase64, mimeType);
      setResult(analysisResult);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InputArea onAnalyze={handleAnalysis} isLoading={isLoading} />
            <ResultsDisplay result={result} isLoading={isLoading} error={error} />
          </div>
          <div className="lg:col-span-1">
            <NotesSection notes={notes} setNotes={setNotes} />
          </div>
        </div>
        <footer className="text-center text-gray-600 mt-8 py-4">
            <p>Powered by Gemini API</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
