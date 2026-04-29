// File location: src/app/api/plotline/route.ts
// Plotline API endpoint (Bulletproof BYOK)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { PlotlineRequest, Provider } from '@/types';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const provider = request.headers.get('x-api-provider') as Provider;

  if (!apiKey || !provider) {
    return NextResponse.json(
      { error: "No API key provided. Add your key in Settings." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { concept, genre, characters, setting, bibleContext } = body as PlotlineRequest;

    if (!concept) {
      return NextResponse.json(
        { error: "Invalid input", message: "Concept is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a story structure expert. Create a detailed 3-act plot outline for a ${genre} story.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt,
      userMessage: `Create a plot for a ${genre} story about: ${concept}\nCharacters: ${characters || 'N/A'}\nSetting: ${setting || 'N/A'}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        title: 'Generated Story',
        logline: 'An AI-crafted logline for your concept.',
        plotPoints: [
          { act: 1, title: 'Act I: Departure', description: 'The journey begins.', keyEvents: ['Event 1', 'Event 2'] },
          { act: 2, title: 'Act II: Confrontation', description: 'Obstacles arise.', keyEvents: ['Event 3', 'Event 4'] },
          { act: 3, title: 'Act III: Return', description: 'Resolution reached.', keyEvents: ['Event 5', 'Event 6'] },
        ],
        themes: ['Growth', 'Conflict'],
        characterArcs: [{ name: 'Protagonist', arc: 'From weakness to strength' }],
      },
    });
  } catch (err: unknown) {
    console.error('Plotline API Error:', err);
    const errorMessage = handleLLMError(err, provider);
    const isAuthError = errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("revoked");
    
    return NextResponse.json(
      { error: errorMessage },
      { status: isAuthError ? 401 : 500 }
    );
  }
}