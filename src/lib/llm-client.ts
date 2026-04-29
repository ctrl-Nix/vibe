// File location: src/lib/llm-client.ts
// LLM API client for OpenAI and Claude (supports BYOK)

import axios from 'axios';

export type LLMProvider = 'openai' | 'anthropic';

class LLMClient {
  async callOpenAI(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data?.error?.message || error.message);
      throw new Error(`OpenAI Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async callClaude(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          temperature,
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.content[0].text;
    } catch (error: any) {
      console.error('Claude API Error:', error.response?.data?.error?.message || error.message);
      throw new Error(`Claude Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async call(
    provider: LLMProvider,
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    if (provider === 'anthropic') {
      return this.callClaude(apiKey, systemPrompt, userPrompt, temperature, maxTokens);
    } else {
      return this.callOpenAI(apiKey, systemPrompt, userPrompt, temperature, maxTokens);
    }
  }
}

export const llmClient = new LLMClient();

// Helper to wrap system prompt with story context
const wrapWithContext = (baseSystemPrompt: string, bibleContext?: string) => {
  if (!bibleContext) return baseSystemPrompt;
  return `You are a creative writing assistant for VIBE.
  
STORY CONTEXT — always respect this when responding:
${bibleContext}

Now help with the following task:
${baseSystemPrompt}`;
};

export async function generateJudgeFeedback(
  provider: LLMProvider,
  apiKey: string,
  text: string,
  genre?: string,
  bibleContext?: string
): Promise<string> {
  const basePrompt = `You are an expert writing critic. Provide detailed feedback on clarity, engagement, grammar, and structure.`;
  const systemPrompt = wrapWithContext(basePrompt, bibleContext);
  const userPrompt = `Please evaluate this writing:\n\n${text}`;
  return await llmClient.call(provider, apiKey, systemPrompt, userPrompt, 0.5, 1500);
}

export async function generateOracleIdeas(
  provider: LLMProvider,
  apiKey: string,
  topic: string,
  type: string,
  style?: string,
  bibleContext?: string
): Promise<string> {
  const basePrompt = `You are a creative writing coach. Generate ${type} ideas for writers. Provide 5+ creative and unique ideas.`;
  const systemPrompt = wrapWithContext(basePrompt, bibleContext);
  const userPrompt = `Generate creative ${type} ideas for: ${topic}`;
  return await llmClient.call(provider, apiKey, systemPrompt, userPrompt, 0.9, 1500);
}

export async function generatePlotline(
  provider: LLMProvider,
  apiKey: string,
  concept: string,
  genre: string,
  characters?: string,
  setting?: string,
  bibleContext?: string
): Promise<string> {
  const basePrompt = `You are a story structure expert. Create a detailed 3-act plot outline for a ${genre} story.`;
  const systemPrompt = wrapWithContext(basePrompt, bibleContext);
  let userPrompt = `Create a plot for a ${genre} story about: ${concept}`;
  if (characters) userPrompt += `\nCharacters: ${characters}`;
  if (setting) userPrompt += `\nSetting: ${setting}`;
  return await llmClient.call(provider, apiKey, systemPrompt, userPrompt, 0.8, 2500);
}

export async function optimizePrompt(
  provider: LLMProvider,
  apiKey: string,
  prompt: string,
  targetModel?: string,
  bibleContext?: string
): Promise<string> {
  const basePrompt = `You are a prompt engineering expert. Improve prompts to get better results from AI models. ${targetModel ? `Optimize for ${targetModel}.` : ''}`;
  const systemPrompt = wrapWithContext(basePrompt, bibleContext);
  const userPrompt = `Please improve this prompt:\n\n${prompt}`;
  return await llmClient.call(provider, apiKey, systemPrompt, userPrompt, 0.5, 1500);
}

export function parseJudgeFeedback(response: string) {
  return {
    score: 75,
    strengths: ['Well-structured narrative', 'Clear language', 'Good engagement'],
    improvements: ['Add more description', 'Strengthen transitions', 'Improve pacing'],
    clarity: 80,
    engagement: 75,
    structure: 85,
    grammar: 90,
    feedback: response,
  };
}