// File location: src/app/api/oracle/route.ts
// Oracle API endpoint (Bulletproof BYOK)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { OracleRequest, Provider } from '@/types';

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
    const { topic, type, style, bibleContext } = body as OracleRequest;

    if (!topic) {
      return NextResponse.json(
        { error: "Invalid input", message: "Topic is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a creative writing coach. Generate ${type} ideas for writers. Provide 5+ creative and unique ideas.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt,
      userMessage: `Generate creative ${type} ideas for: ${topic}${style ? `\nStyle/Tone: ${style}` : ''}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        ideas: result.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
        suggestions: ['Explore the internal conflict', 'Add a ticking clock element'],
        examples: ['A scene where the character loses everything but gains clarity.'],
        tips: ['Focus on sensory details', 'Keep the stakes personal'],
      },
    });
  } catch (err: unknown) {
    console.error('Oracle API Error:', err);
    const errorMessage = handleLLMError(err, provider);
    const isAuthError = errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("revoked");
    
    return NextResponse.json(
      { error: errorMessage },
      { status: isAuthError ? 401 : 500 }
    );
  }
}