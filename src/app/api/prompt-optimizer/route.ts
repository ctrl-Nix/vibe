// File location: src/app/api/prompt-optimizer/route.ts
// Prompt Optimizer API (Teaching Mode)

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

    const toolPrompt = `You are a prompt engineering professor at a top university. Your job is not just to rewrite prompts — it's to teach users exactly why their prompt was weak and what principles make a prompt powerful.

Analyze the user's prompt deeply. Identify specific fragments that are weak. For each fragment, name the principle it violates and explain the fix concisely.

Principles you can reference:
- be-specific: prompt is too vague or broad
- add-context: missing background the AI needs
- define-output: didn't specify format, length, or structure
- set-constraints: no boundaries or scope given
- show-example: would benefit from an example
- reduce-ambiguity: could be interpreted multiple ways
- add-role: no persona or expertise assigned to the AI
${targetModel ? `\nTarget Model: ${targetModel}` : ''}
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;

    const schema = `{
  "original": "verbatim original prompt",
  "optimized": "fully rewritten prompt",
  "score_before": number (1-10),
  "score_after": number (1-10),
  "lesson_summary": "one sentence: the most important thing this user should learn from this",
  "annotations": [
    {
      "id": "a1",
      "original_fragment": "exact substring from original",
      "issue": "concise explanation of what's wrong",
      "fix": "what the optimized version does instead",
      "principle": "be-specific|add-context|define-output|set-constraints|show-example|reduce-ambiguity|add-role"
    }
  ],
  "principle_counts": {
    "be-specific": number,
    "add-context": number
  }
}`;

    const result = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Please improve this prompt and teach me why:\n\n${prompt}`,
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