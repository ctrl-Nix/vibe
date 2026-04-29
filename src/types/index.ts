// File location: src/types/index.ts
// TypeScript types for VIBE

export interface StoryBible {
  title: string;
  genre: string;
  characters: string;
  setting: string;
  tone: string;
}

export interface JudgeRequest {
  text: string;
  genre?: string;
  tone?: string;
  bibleContext?: string;
}

// Structured Result Types
export interface JudgeResult {
  score: number;
  verdict: string;
  strengths: string[];
  fixes: string[];
  verdict_tag: "needs-work" | "promising" | "strong" | "excellent";
}

export interface OracleResult {
  ideas: {
    title: string;
    description: string;
    twist: string;
  }[];
}

export interface PlotlineResult {
  title: string;
  genre: string;
  acts: {
    act: "Act I" | "Act II" | "Act III";
    label: string;
    beats: string[];
  }[];
  theme: string;
  hook: string;
}

export interface PromptOptimizerResult {
  original: string;
  optimized: string;
  changes: {
    what: string;
    why: string;
  }[];
  score_before: number;
  score_after: number;
}

export interface OracleRequest {
  topic: string;
  type: 'character' | 'plot' | 'dialogue' | 'worldbuilding' | 'general';
  style?: string;
  context?: string;
  bibleContext?: string;
}

export interface PlotlineRequest {
  concept: string;
  genre: string;
  characters?: string;
  setting?: string;
  tone?: string;
  bibleContext?: string;
}

export interface PromptOptimizerRequest {
  prompt: string;
  targetModel?: string;
  useCase?: string;
  bibleContext?: string;
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

// BYOK Types
export type Provider = 'gemini' | 'openai' | 'anthropic';

export interface ApiConfig {
  key: string;
  provider: Provider;
}

// Workflow Chain Types
export type ToolId = "oracle" | "plotline" | "judge" | "prompt-optimizer";

export interface WorkflowPayload {
  sourceToolId: ToolId;
  content: string;
  bibleContext?: string;
  timestamp: number;
}

export const WORKFLOW_ROUTES: Record<ToolId, ToolId[]> = {
  "oracle":           ["plotline", "judge"],
  "plotline":         ["judge", "prompt-optimizer"],
  "judge":            ["prompt-optimizer", "oracle"],
  "prompt-optimizer": ["oracle", "plotline"],
};

export interface ToolMetadata {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}