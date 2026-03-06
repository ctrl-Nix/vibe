// File location: src/app/api/oracle/route.ts
// Oracle API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { generateOracleIdeas } from '@/lib/llm-client';
import { OracleRequest, OracleResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { topic, type, style, context } = body as OracleRequest;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Topic is required' } as ApiError,
        { status: 400 }
      );
    }

    if (!type || !['character', 'plot', 'dialogue', 'worldbuilding', 'general'].includes(type)) {
      return NextResponse.json(
        {
          error: 'Invalid type',
          message: "Type must be one of: character, plot, dialogue, worldbuilding, general",
        } as ApiError,
        { status: 400 }
      );
    }

    const ideas = await generateOracleIdeas(topic, type, style);

    return NextResponse.json({
      success: true,
      data: {
        ideas: [
          'Creative idea 1 generated from your topic',
          'Creative idea 2 generated from your topic',
          'Creative idea 3 generated from your topic',
        ],
        suggestions: [
          'Consider combining multiple ideas',
          'Use these as starting points for exploration',
        ],
        examples: [
          'Example 1 based on your topic',
          'Example 2 showing implementation',
        ],
        tips: [
          'Let ideas develop naturally',
          'Dont edit while brainstorming',
          'Combine unexpected elements',
        ],
      } as OracleResponse,
    });
  } catch (error: any) {
    console.error('Oracle API Error:', error);

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