// File location: src/app/api/oracle/route.ts
// Oracle API endpoint (Structured JSON Output)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { withJsonOutput } from '@/lib/structuredPrompt';
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
    const { topic, type, style, bibleContext, isSynthesis, ideasToSynthesize } = body;

    if (!topic && !isSynthesis) {
      return NextResponse.json(
        { error: "Invalid input", message: "Topic is required" },
        { status: 400 }
      );
    }

    let toolPrompt = `You are a creative writing muse. Generate exactly 3 distinct, imaginative ideas based on the user's request. Each idea should surprise and inspire.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    let userMessage = `Generate creative ${type} ideas for: ${topic}${style ? `\nStyle/Tone: ${style}` : ''}`;

    if (isSynthesis && ideasToSynthesize) {
      toolPrompt = `You are a master narrative architect. Take the following separate ideas and synthesize them into ONE unified, complex, and high-concept story premise. Return it in the ideas array (just one item).
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;
      userMessage = `Synthesize these ideas into one masterpiece:\n\n${ideasToSynthesize.join('\n\n---\n\n')}`;
    }

    const schema = `{
  "ideas": [
    {
      "title": "4-6 word punchy headline",
      "description": "2-3 sentence expansion",
      "twist": "one unexpected angle"
    }
  ]
}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage,
    });

    return NextResponse.json({
      success: true,
      data: result,
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