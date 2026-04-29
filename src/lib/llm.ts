import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Provider } from "@/types";

export async function callLLM({
  apiKey,
  provider,
  systemPrompt,
  userMessage,
}: {
  apiKey: string;
  provider: Provider;
  systemPrompt: string;
  userMessage: string;
}): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 30000)
  );

  const llmCall = (async () => {
    if (provider === "gemini") {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(
        systemPrompt + "\n\n" + userMessage
      );
      return result.response.text();
    }

    if (provider === "openai") {
      const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: false });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      });
      return response.choices[0].message.content ?? "";
    }

    if (provider === "anthropic") {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });
      return (response.content[0] as { text: string }).text;
    }

    throw new Error("Unknown provider");
  })();

  return Promise.race([llmCall, timeoutPromise]);
}
