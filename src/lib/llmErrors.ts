import { Provider } from "@/types";

export function handleLLMError(
  err: unknown, 
  provider: Provider
): string {
  const msg = (err instanceof Error ? err.message : 
    JSON.stringify(err)).toLowerCase();

  if (msg.includes("401") || msg.includes("invalid") || 
      msg.includes("api_key_invalid") || 
      msg.includes("authentication") || msg.includes("unauthorized")) {
    return `Your ${provider} key is invalid or has been revoked. 
      Re-enter it in Settings.`;
  }
  if (msg.includes("429") || msg.includes("quota") || 
      msg.includes("rate")) {
    const extra = provider === "gemini" 
      ? " Free tier limit reached — wait a minute or check aistudio.google.com" 
      : " Check your usage dashboard.";
    return `Rate limit hit.${extra}`;
  }
  if (msg.includes("402") || msg.includes("billing") || 
      msg.includes("credit")) {
    return `Your ${provider} account is out of credits. 
      Add credits in your provider dashboard.`;
  }
  if (msg.includes("503") || msg.includes("529") || 
      msg.includes("overload")) {
    return `${provider} is temporarily down. Try again in a moment.`;
  }
  if (msg.includes("timeout") || msg.includes("network") || 
      msg.includes("fetch")) {
    return "Network error. Check your connection and try again.";
  }
  return `Something went wrong with ${provider}. Please try again.`;
}
