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

    // 1. Initial Critique
    const initialResultRaw = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Please evaluate this writing:\n\n${text}${genre ? `\nGenre: ${genre}` : ''}`,
    });

    // Parse initial critique
    let initialCritique;
    try {
      const cleaned = initialResultRaw.replace(/```json/gi, '').replace(/```/g, '').trim();
      initialCritique = JSON.parse(cleaned);
    } catch(e) {
      initialCritique = { score: 0 };
    }

    // 2. Rewrite
    const rewriteSystemPrompt = `You are an expert editor. Rewrite the following text based on the critique provided. Ensure you maintain the original voice but apply all suggested fixes. Return ONLY the rewritten text, with no conversational filler or markdown formatting.
${bibleContext ? `\nSTORY CONTEXT:\n${bibleContext}` : ''}`;
    
    const rewriteUserMessage = `ORIGINAL TEXT:\n${text}\n\nCRITIQUE TO APPLY:\n${initialResultRaw}`;

    const rewrittenText = await callLLM({
      apiKey,
      provider,
      systemPrompt: rewriteSystemPrompt,
      userMessage: rewriteUserMessage,
    });

    // 3. Re-critique
    const finalResultRaw = await callLLM({
      apiKey,
      provider,
      systemPrompt: withJsonOutput(toolPrompt, schema),
      userMessage: `Please evaluate this writing:\n\n${rewrittenText}${genre ? `\nGenre: ${genre}` : ''}`,
    });

    // Add rewritten_text and original_score to final result
    let finalJson;
    try {
      const cleanedFinal = finalResultRaw.replace(/```json/gi, '').replace(/```/g, '').trim();
      finalJson = JSON.parse(cleanedFinal);
      finalJson.rewritten_text = rewrittenText.trim();
      finalJson.original_score = initialCritique.score;
    } catch(e) {
      // If parsing fails, we'll try to just return the raw string (the frontend might fail to parse, but this is the best effort)
      return NextResponse.json({
        success: true,
        data: finalResultRaw,
      });
    }

    return NextResponse.json({
      success: true,
      data: JSON.stringify(finalJson),
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