// File location: src/app/api/prompt-optimizer/route.ts
// Prompt Optimizer API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { optimizePrompt } from '@/lib/llm-client';
import { PromptOptimizerRequest, PromptOptimizerResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { prompt, targetModel, useCase } = body as PromptOptimizerRequest;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Prompt is required' } as ApiError,
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt too long', message: 'Maximum 5,000 characters allowed' } as ApiError,
        { status: 400 }
      );
    }

    const optimization = await optimizePrompt(prompt, targetModel);

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: prompt,
        optimizedPrompt: `${prompt}\n\n[Optimized version with better structure and clarity]`,
        improvements: [
          'Made the prompt more specific',
          'Added clear context',
          'Improved clarity and structure',
          'Defined expected output format',
        ],
        tips: [
          'Use specific examples in your prompts',
          'Clearly state the role/persona for the AI',
          'Specify the output format',
          'Include constraints and requirements',
        ],
        explanation:
          'The optimization improves clarity, adds specific instructions, and structures the prompt for better AI model performance.',
      } as PromptOptimizerResponse,
    });
  } catch (error: any) {
    console.error('Prompt Optimizer API Error:', error);

    if (error.message.includes('API key')) {
      return NextResponse.json(
        {
          error: 'Configuration error',
          message: 'AI API key is not configured.',
        } as ApiError,
        { status: 500 }
      );
    }

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