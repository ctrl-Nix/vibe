export function withJsonOutput(
  toolPrompt: string,
  schema: string
): string {
  return `${toolPrompt}

CRITICAL: You must respond with ONLY valid JSON.
No markdown, no backticks, no explanation outside the JSON.
Follow this exact schema:
${schema}

If you cannot generate a response, return:
{ "error": "brief reason why" }`;
}
