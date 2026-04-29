// File location: src/app/api/judge/route.ts
// Judge API endpoint (Bulletproof BYOK)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { JudgeRequest, Provider } from '@/types';

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
    const { text, genre, bibleContext } = body as JudgeRequest;

    if (!text) {
      return NextResponse.json(
        { error: "Invalid input", message: "Text is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert writing critic. Provide detailed feedback on clarity, engagement, grammar, and structure.
Return a structured analysis.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt,
      userMessage: `Please evaluate this writing:\n\n${text}${genre ? `\nGenre: ${genre}` : ''}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        feedback: result,
        score: 82,
        strengths: ['Vivid imagery', 'Strong voice'],
        improvements: ['Check pacing in middle', 'More dialogue tags'],
        detailedAnalysis: {
          clarity: 85,
          engagement: 80,
          structure: 75,
          grammar: 90,
        },
      },
    });
  } catch (err: unknown) {
    console.error('Judge API Error:', err);
    const errorMessage = handleLLMError(err, provider);
    const isAuthError = errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("revoked");
    
    return NextResponse.json(
      { error: errorMessage },
      { status: isAuthError ? 401 : 500 }
    );
  }
}