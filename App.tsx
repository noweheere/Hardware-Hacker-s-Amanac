import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultsDisplay from './components/ResultsDisplay';
import NotesSection from './components/NotesSection';
// FIX: Removed SettingsModal as it is no longer used.
import { AnalysisResult } from './types'; // FIX: Removed AiProvider import.
import { analyzeHardware } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notes, setNotes] = useLocalStorage<string>('hackingNotes', '');
  const [lastAnalysisRequest, setLastAnalysisRequest] = useState<{ textInput?: string; imageBase64?: string; mimeType?: string } | null>(null);
  
  // FIX: Removed settings modal state and API key management logic to comply with guidelines.

  const handleAnalysis = async (textInput?: string, imageBase64?: string, mimeType?: string) => {
    // Store the request so we can retry it
    setLastAnalysisRequest({ textInput, imageBase64, mimeType });
    
    // FIX: Removed isConfigured check. Error handling will now occur in the service.
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // FIX: Removed apiKey from analyzeHardware call.
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
  
  const handleRetry = () => {
    if (lastAnalysisRequest) {
        handleAnalysis(
            lastAnalysisRequest.textInput,
            lastAnalysisRequest.imageBase64,
            lastAnalysisRequest.mimeType
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* FIX: Removed onSettingsClick prop as settings modal is no longer used. */}
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* FIX: Removed isConfigured prop as API key is now handled by environment variables. */}
            <InputArea onAnalyze={handleAnalysis} isLoading={isLoading} />
            <ResultsDisplay result={result} isLoading={isLoading} error={error} onRetry={handleRetry} />
          </div>
          <div className="lg:col-span-1">
            <NotesSection notes={notes} setNotes={setNotes} />
          </div>
        </div>
        <footer className="text-center text-gray-600 mt-8 py-4">
            {/* FIX: Updated footer text to be more specific. */}
            <p>Powered by Google Gemini</p>
        </footer>
      </main>
      {/* FIX: Removed SettingsModal component. */}
    </div>
  );
};

export default App;