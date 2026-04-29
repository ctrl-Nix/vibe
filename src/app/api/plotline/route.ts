// File location: src/app/api/plotline/route.ts
// Plotline API endpoint (Structured JSON Output)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { withJsonOutput } from '@/lib/structuredPrompt';
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

    const toolPrompt = `You are a master story architect. Generate a complete 3-act story structure based on the concept provided.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const schema = `{
  "title": "story title",
  "genre": "genre",
  "acts": [
    {
      "act": "Act I",
      "label": "Setup",
      "beats": ["beat 1", "beat 2", "beat 3"]
    },
    {
      "act": "Act II", 
      "label": "Conflict",
      "beats": ["beat 1", "beat 2", "beat 3"]
    },
    {
      "act": "Act III",
      "label": "Resolution", 
      "beats": ["beat 1", "beat 2", "beat 3"]
    }
  ],
  "theme": "underlying theme in one sentence",
  "hook": "opening hook suggestion"
}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Create a plot for a ${genre} story about: ${concept}\nCharacters: ${characters || 'N/A'}\nSetting: ${setting || 'N/A'}`,
    });

    return NextResponse.json({
      success: true,
      data: result,
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