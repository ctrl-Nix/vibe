import { Provider } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { handleLLMError } from "./llmErrors";

export async function testKey(
  key: string,
  provider: Provider
): Promise<{ success: boolean; error?: string }> {
  try {
    if (provider === "gemini") {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      await model.generateContent("Say: ok");
      return { success: true };
    }

    if (provider === "openai") {
      const client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
      await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say: ok" }],
        max_tokens: 5,
      });
      return { success: true };
    }

    if (provider === "anthropic") {
      const client = new Anthropic({ apiKey: key });
      await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 5,
        messages: [{ role: "user", content: "Say: ok" }],
      });
      return { success: true };
    }

    return { success: false, error: "Unknown provider" };
  } catch (err) {
    console.error(`Error testing ${provider} key:`, err);
    return { 
      success: false, 
      error: handleLLMError(err, provider) 
    };
  }
}
