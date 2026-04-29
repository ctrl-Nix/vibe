// File location: src/app/api/prompt-optimizer/route.ts
// Prompt Optimizer API endpoint (Bulletproof BYOK)

import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { handleLLMError } from '@/lib/llmErrors';
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

    const systemPrompt = `You are a prompt engineering expert. Improve prompts to get better results from AI models.
${targetModel ? `Target Model: ${targetModel}` : ''}
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt,
      userMessage: `Please improve this prompt:\n\n${prompt}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: prompt,
        optimizedPrompt: result,
        improvements: ['Added role definition', 'Clarified constraints', 'Structured output format'],
        tips: ['Use delimiters', 'Provide few-shot examples'],
        explanation: 'The optimization adds context and clear expectations for the AI.',
      },
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