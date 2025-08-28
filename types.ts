export interface AnalysisResult {
  componentName: string;
  description: string;
  specifications: Record<string, string>;
  datasheetUrl: string;
  hackingGuide: string;
  recommendedTools: string[];
  communityLinks: string[];
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResult | null;
  notes: string;
}
