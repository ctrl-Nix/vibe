import { Provider } from "@/types";

export function validateKeyFormat(
  key: string, 
  provider: Provider
): { valid: boolean; error?: string } {
  const k = key.trim();
  if (!k) return { valid: false, error: "Key cannot be empty." };
  
  if (provider === "gemini" && !k.startsWith("AIza")) {
    return { valid: false, error: 
      "Gemini keys start with 'AIza'. Check your key." };
  }
  if (provider === "openai" && !k.startsWith("sk-")) {
    return { valid: false, error: 
      "OpenAI keys start with 'sk-'. Check your key." };
  }
  if (provider === "anthropic" && !k.startsWith("sk-ant-")) {
    return { valid: false, error: 
      "Anthropic keys start with 'sk-ant-'. Check your key." };
  }
  return { valid: true };
}
