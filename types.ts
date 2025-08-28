
export enum InputMode {
  Upload = 'Upload',
  Camera = 'Camera',
  Text = 'Text',
}

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
