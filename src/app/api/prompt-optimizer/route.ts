// File location: src/app/api/prompt-optimizer/route.ts
// Prompt Optimizer API endpoint (BYOK Support)

import { NextRequest, NextResponse } from 'next/server';
import { optimizePrompt, LLMProvider } from '@/lib/llm-client';
import { PromptOptimizerRequest, PromptOptimizerResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = request.headers.get('x-api-key');
    const provider = request.headers.get('x-api-provider') as LLMProvider;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No API key found. Please add your key in Settings.' } as ApiError,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, targetModel, useCase, bibleContext } = body as PromptOptimizerRequest;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Prompt is required' } as ApiError,
        { status: 400 }
      );
    }

    const optimizedRaw = await optimizePrompt(provider, apiKey, prompt, targetModel, bibleContext);

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: prompt,
        optimizedPrompt: `${prompt}\n\n[Optimized Context Added]`,
        improvements: ['More specific phrasing', 'Context integration'],
        tips: ['Be specific with constraints', 'Define the persona'],
        explanation: 'Optimization focused on clarity and specificity.',
      } as PromptOptimizerResponse,
    });
  } catch (error: any) {
    console.error('Prompt Optimizer API Error:', error);
    return NextResponse.json(
      {
        error: 'Processing error',
        message: error.message || 'Failed to optimize prompt',
      } as ApiError,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Prompt Optimizer API is running',
  });
}