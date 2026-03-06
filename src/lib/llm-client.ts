// File location: src/lib/llm-client.ts
// LLM API client for OpenAI and Claude

import axios from 'axios';

class LLMClient {
  private openaiApiKey: string;
  private anthropicApiKey: string;
  private provider: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
    this.provider = process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || 'openai';
  }

  async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

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
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API Error:', error.message);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  async callClaude(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    try {
      if (!this.anthropicApiKey) {
        throw new Error('Anthropic API key not configured');
      }

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
            'x-api-key': this.anthropicApiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.content[0].text;
    } catch (error: any) {
      console.error('Claude API Error:', error.message);
      throw new Error(`Claude API Error: ${error.message}`);
    }
  }

  async call(
    systemPrompt: string,
    userPrompt: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    if (this.provider === 'anthropic') {
      return this.callClaude(systemPrompt, userPrompt, temperature, maxTokens);
    } else {
      return this.callOpenAI(systemPrompt, userPrompt, temperature, maxTokens);
    }
  }
}

export const llmClient = new LLMClient();

export async function generateJudgeFeedback(text: string, genre?: string): Promise<string> {
  const systemPrompt = `You are an expert writing critic. Provide detailed feedback on clarity, engagement, grammar, and structure.`;
  const userPrompt = `Please evaluate this writing:\n\n${text}`;
  return await llmClient.call(systemPrompt, userPrompt, 0.5, 1500);
}

export async function generateOracleIdeas(topic: string, type: string, style?: string): Promise<string> {
  const systemPrompt = `You are a creative writing coach. Generate ${type} ideas for writers. Provide 5+ creative and unique ideas.`;
  const userPrompt = `Generate creative ${type} ideas for: ${topic}`;
  return await llmClient.call(systemPrompt, userPrompt, 0.9, 1500);
}

export async function generatePlotline(
  concept: string,
  genre: string,
  characters?: string,
  setting?: string
): Promise<string> {
  const systemPrompt = `You are a story structure expert. Create a detailed 3-act plot outline for a ${genre} story.`;
  let userPrompt = `Create a plot for a ${genre} story about: ${concept}`;
  if (characters) userPrompt += `\nCharacters: ${characters}`;
  if (setting) userPrompt += `\nSetting: ${setting}`;
  return await llmClient.call(systemPrompt, userPrompt, 0.8, 2500);
}

export async function optimizePrompt(prompt: string, targetModel?: string): Promise<string> {
  const systemPrompt = `You are a prompt engineering expert. Improve prompts to get better results from AI models. ${targetModel ? `Optimize for ${targetModel}.` : ''}`;
  const userPrompt = `Please improve this prompt:\n\n${prompt}`;
  return await llmClient.call(systemPrompt, userPrompt, 0.5, 1500);
}

export function parseJudgeFeedback(response: string): {
  score: number;
  strengths: string[];
  improvements: string[];
  clarity: number;
  engagement: number;
  structure: number;
  grammar: number;
  feedback: string;
} {
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