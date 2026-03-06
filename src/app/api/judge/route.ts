// File location: src/app/api/judge/route.ts
// Judge API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { generateJudgeFeedback, parseJudgeFeedback } from '@/lib/llm-client';
import { JudgeRequest, JudgeResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { text, genre, tone } = body as JudgeRequest;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Text is required' } as ApiError,
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long', message: 'Maximum 10,000 characters allowed' } as ApiError,
        { status: 400 }
      );
    }

    const feedback = await generateJudgeFeedback(text, genre);
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

    if (error.message.includes('API key')) {
      return NextResponse.json(
        {
          error: 'Configuration error',
          message: 'AI API key is not configured. Please set up your API key in environment variables.',
        } as ApiError,
        { status: 500 }
      );
    }

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