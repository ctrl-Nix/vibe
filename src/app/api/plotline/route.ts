// File location: src/app/api/plotline/route.ts
// Plotline API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { generatePlotline } from '@/lib/llm-client';
import { PlotlineRequest, PlotlineResponse, ApiError } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { concept, genre, characters, setting, tone } = body as PlotlineRequest;

    if (!concept || concept.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Story concept is required' } as ApiError,
        { status: 400 }
      );
    }

    if (!genre || genre.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input', message: 'Genre is required' } as ApiError,
        { status: 400 }
      );
    }

    const plotContent = await generatePlotline(concept, genre, characters, setting);

    const plotPoints = [
      {
        act: 1,
        title: 'Setup',
        description: 'Introduce characters and world',
        keyEvents: ['Event 1', 'Event 2', 'Event 3'],
      },
      {
        act: 2,
        title: 'Conflict',
        description: 'Raise stakes and develop tension',
        keyEvents: ['Event 1', 'Event 2', 'Event 3'],
      },
      {
        act: 3,
        title: 'Resolution',
        description: 'Resolve conflicts and conclude',
        keyEvents: ['Event 1', 'Event 2', 'Event 3'],
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        title: 'Your Story Title',
        logline:
          'A compelling one-sentence summary of your story that captures the essence of the narrative.',
        plotPoints: plotPoints,
        themes: ['Redemption', 'Identity', 'Courage'],
        characterArcs: [
          {
            name: 'Protagonist',
            arc: 'Grows from uncertainty to confidence',
          },
        ],
        chapters: [
          { number: 1, title: 'Chapter 1', summary: 'Introduction' },
          { number: 2, title: 'Chapter 2', summary: 'Inciting incident' },
        ],
      } as PlotlineResponse,
    });
  } catch (error: any) {
    console.error('Plotline API Error:', error);

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
        message: error.message || 'Failed to generate plot',
      } as ApiError,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Plotline API is running',
  });
}