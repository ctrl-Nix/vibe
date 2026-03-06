// File location: src/types/index.ts
// TypeScript types for VIBE

export interface JudgeRequest {
  text: string;
  genre?: string;
  tone?: string;
}

export interface JudgeResponse {
  feedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
  detailedAnalysis: {
    clarity: number;
    engagement: number;
    structure: number;
    grammar: number;
  };
}

export interface OracleRequest {
  topic: string;
  type: 'character' | 'plot' | 'dialogue' | 'worldbuilding' | 'general';
  style?: string;
  context?: string;
}

export interface OracleResponse {
  ideas: string[];
  suggestions: string[];
  examples: string[];
  tips: string[];
}

export interface PlotlineRequest {
  concept: string;
  genre: string;
  characters?: string;
  setting?: string;
  tone?: string;
}

export interface PlotPoint {
  act: number;
  title: string;
  description: string;
  keyEvents: string[];
}

export interface PlotlineResponse {
  title: string;
  logline: string;
  plotPoints: PlotPoint[];
  themes: string[];
  characterArcs: {
    name: string;
    arc: string;
  }[];
  chapters?: {
    number: number;
    title: string;
    summary: string;
  }[];
}

export interface PromptOptimizerRequest {
  prompt: string;
  targetModel?: string;
  useCase?: string;
}

export interface PromptOptimizerResponse {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  tips: string[];
  explanation: string;
}

export interface ApiError {
  error: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type LLMProvider = 'openai' | 'anthropic';

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}