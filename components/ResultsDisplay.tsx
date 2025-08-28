
import React from 'react';
import { AnalysisResult } from '../types';
import Spinner from './Spinner';
import { LinkIcon } from './Icons';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-cyan-400/50 transition-colors duration-300">
    <h3 className="text-lg font-bold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-2">{title}</h3>
    <div className="space-y-2 text-gray-300">{children}</div>
  </div>
);

const ExternalLink: React.FC<{ href: string; text: string }> = ({ href, text }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 hover:underline transition-colors duration-200">
    {text}
    <LinkIcon />
  </a>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return <Spinner message="Analyzing hardware..." />;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
        <p className="font-bold">Analysis Failed</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-600">
        <p className="text-lg text-gray-400">Awaiting analysis...</p>
        <p className="text-sm text-gray-500">Provide an image, use your camera, or enter a model number to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-3xl font-bold text-cyan-300">{result.componentName}</h2>
        <p className="mt-2 text-gray-300">{result.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard title="Specifications">
          <ul className="list-disc list-inside space-y-1">
            {result.specifications.map((spec, i) => <li key={i}>{spec}</li>)}
          </ul>
        </ResultCard>

        <ResultCard title="Datasheet">
          {result.datasheetUrl ? (
            <ExternalLink href={result.datasheetUrl} text="View Datasheet" />
          ) : (
            <p>No datasheet found.</p>
          )}
        </ResultCard>
      </div>

      <ResultCard title="Hacking Tutorials & Guides">
        {result.tutorials.length > 0 ? (
          <div className="space-y-4">
            {result.tutorials.map((tut, i) => (
              <div key={i} className="border-b border-gray-700 pb-3 last:border-b-0">
                <ExternalLink href={tut.url} text={tut.title} />
                <p className="text-sm text-gray-400 mt-1">{tut.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No specific tutorials found.</p>
        )}
      </ResultCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard title="Tools & Software">
          {result.tools.length > 0 ? (
            <div className="space-y-4">
              {result.tools.map((tool, i) => (
                <div key={i}>
                  <ExternalLink href={tool.url} text={tool.name} />
                  <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No specific tools found.</p>
          )}
        </ResultCard>

        <ResultCard title="Communities">
          {result.communities.length > 0 ? (
            <ul className="space-y-2">
              {result.communities.map((com, i) => (
                <li key={i}>
                    <ExternalLink href={com.url} text={com.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific communities found.</p>
          )}
        </ResultCard>
      </div>
    </div>
  );
};

export default ResultsDisplay;
