export function parseStructuredOutput<T>(raw: string): 
  { data: T | null; error: string | null } {
  
  try {
    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    
    const data = JSON.parse(cleaned) as T;
    
    // Check if AI returned an error object
    if (data && typeof data === 'object' && "error" in (data as object)) {
      return { 
        data: null, 
        error: (data as unknown as { error: string }).error 
      };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error("JSON Parse Error:", err, "Raw:", raw);
    return { 
      data: null, 
      error: "Couldn't parse the response. Try again." 
    };
  }
}
