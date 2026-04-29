// File location: src/app/api/prompt-optimizer/route.ts
// Prompt Optimizer API endpoint (Structured JSON Output)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
import { withJsonOutput } from '@/lib/structuredPrompt';
import { PromptOptimizerRequest, Provider } from '@/types';

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
    const { prompt, targetModel, bibleContext } = body as PromptOptimizerRequest;

    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid input", message: "Prompt is required" },
        { status: 400 }
      );
    }

    const toolPrompt = `You are a prompt engineering expert. Analyze the user's prompt, identify exactly what makes it weak, and rewrite it to be specific, clear, and effective.
${targetModel ? `Target Model: ${targetModel}` : ''}
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const schema = `{
  "original": "the original prompt verbatim",
  "optimized": "the rewritten prompt",
  "changes": [
    {
      "what": "what changed",
      "why": "why this improves the prompt"
    }
  ],
  "score_before": number (1-10),
  "score_after": number (1-10)
}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Please improve this prompt:\n\n${prompt}`,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    console.error('Prompt Optimizer API Error:', err);
    const errorMessage = handleLLMError(err, provider);
    const isAuthError = errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("revoked");
    
    return NextResponse.json(
      { error: errorMessage },
      { status: isAuthError ? 401 : 500 }
    );
  }
}