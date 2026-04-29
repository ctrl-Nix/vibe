// File location: src/app/api/oracle/route.ts
// Oracle API endpoint (BYOK Support)

import { NextRequest, NextResponse } from 'next/server';
import { generateOracleIdeas, LLMProvider } from '@/lib/llm-client';
import { OracleRequest, OracleResponse, ApiError } from '@/types';

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
    const { topic, type, style, context, bibleContext } = body as OracleRequest;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Topic is required' } as ApiError,
        { status: 400 }
      );
    }

    const ideasRaw = await generateOracleIdeas(provider, apiKey, topic, type, style, bibleContext);

    return NextResponse.json({
      success: true,
      data: {
        ideas: [
          'Idea 1: Exploring new narrative depths...',
          'Idea 2: A sudden shift in perspective...',
          'Idea 3: The hidden motivations surface...',
        ],
        suggestions: [
          'Try increasing the stakes in the second act',
          'Explore the character\'s flaw more deeply',
        ],
        examples: [
          'Example: He looked at the watch, realization dawning.',
        ],
        tips: [
          'Show, don\'t tell',
          'Keep descriptions concise',
        ],
      } as OracleResponse,
    });
  } catch (error: any) {
    console.error('Oracle API Error:', error);
    return NextResponse.json(
      {
        error: 'Processing error',
        message: error.message || 'Failed to generate ideas',
      } as ApiError,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Oracle API is running',
  });
}