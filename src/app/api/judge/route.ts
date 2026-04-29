// File location: src/app/api/judge/route.ts
// Judge API endpoint (BYOK Support)

import { NextRequest, NextResponse } from 'next/server';
import { generateJudgeFeedback, parseJudgeFeedback, LLMProvider } from '@/lib/llm-client';
import { JudgeRequest, JudgeResponse, ApiError } from '@/types';

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
    const { text, genre, tone, bibleContext } = body as JudgeRequest;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Text is required' } as ApiError,
        { status: 400 }
      );
    }

    const feedback = await generateJudgeFeedback(provider, apiKey, text, genre, bibleContext);
    const parsedFeedback = parseJudgeFeedback(feedback);

    return NextResponse.json({
      success: true,
      data: {
        feedback: feedback,
        score: parsedFeedback.score,
        strengths: parsedFeedback.strengths,
        improvements: parsedFeedback.improvements,
        detailedAnalysis: {
          clarity: parsedFeedback.clarity,
          engagement: parsedFeedback.engagement,
          structure: parsedFeedback.structure,
          grammar: parsedFeedback.grammar,
        },
      } as JudgeResponse,
    });
  } catch (error: any) {
    console.error('Judge API Error:', error);
    return NextResponse.json(
      {
        error: 'Processing error',
        message: error.message || 'Failed to generate feedback',
      } as ApiError,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Judge API is running',
  });
}