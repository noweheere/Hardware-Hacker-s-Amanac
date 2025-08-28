
export enum InputMode {
  Upload = 'Upload',
  Camera = 'Camera',
  Text = 'Text',
}

// FIX: Removed AiProvider enum as it's no longer needed after refactoring to use a single provider via environment variables.

export interface HackingResource {
  title: string;
  url: string;
  description: string;
}

export interface ToolResource {
    name: string;
    url: string;
    description: string;
}

export interface CommunityResource {
    name: string;
    url: string;
    community: string;
}

export interface AnalysisResult {
  componentName: string;
  description: string;
  specifications: string[];
  datasheetUrl: string;
  tutorials: HackingResource[];
  tools: ToolResource[];
  communities: CommunityResource[];
}
