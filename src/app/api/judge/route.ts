// File location: src/app/api/judge/route.ts
// Judge API endpoint (Structured JSON Output)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { withJsonOutput } from '@/lib/structuredPrompt';
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

    const toolPrompt = `You are an expert writing coach. Evaluate the writing sample provided. Be honest, specific, and constructive.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const schema = `{
  "score": number (1-10),
  "verdict": "one punchy sentence summary",
  "strengths": ["strength 1", "strength 2"],
  "fixes": ["specific fix 1", "specific fix 2", "specific fix 3"],
  "verdict_tag": "needs-work|promising|strong|excellent"
}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Please evaluate this writing:\n\n${text}${genre ? `\nGenre: ${genre}` : ''}`,
    });

    return NextResponse.json({
      success: true,
      data: result, // result is the raw JSON string from AI
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