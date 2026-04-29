// File location: src/app/tools/prompt-optimizer/page.tsx
// Prompt Optimizer tool page (Teaching Mode & Advanced Retries)

'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import { PromptOptimizerCard } from '@/components/output/PromptOptimizerCard';
import { PromptOptimizerResult, ApiError, ToolId } from '@/types';
import { useBible } from '@/hooks/useBible';
import { getWorkflowPayload, isPayloadFresh, clearWorkflowPayload } from '@/lib/workflowStore';
import { parseStructuredOutput } from '@/lib/parseOutput';

import { OptimizerIcon } from '@/components/Icons';

export default function PromptOptimizerPage() {
  const [result, setResult] = useState<PromptOptimizerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<FormData | undefined>(undefined);
  const [incomingBanner, setIncomingBanner] = useState<ToolId | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastInputRef = useRef<string | null>(null);

  const { formattedContext } = useBible();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const payload = getWorkflowPayload();
    if (payload && isPayloadFresh(payload)) {
      setInitialData({ prompt: payload.content });
      setIncomingBanner(payload.sourceToolId);
      clearWorkflowPayload();
      
      const timer = setTimeout(() => setIncomingBanner(null), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fields: FormField[] = [
    {
      name: 'prompt',
      label: 'Your Prompt',
      type: 'textarea',
      placeholder: 'Paste the prompt you want to improve...',
      required: true,
      rows: 6,
    },
    {
      name: 'targetModel',
      label: 'Target AI Model (Optional)',
      type: 'select',
      options: [
        { value: '', label: 'Any AI model' },
        { value: 'ChatGPT', label: 'ChatGPT' },
        { value: 'Claude', label: 'Claude' },
        { value: 'Gemini', label: 'Google Gemini' },
      ],
    },
  ];

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError("Request cancelled.");
    }
  };

  const handleSubmit = async (formData: FormData, isRetry = false) => {
    const apiKey = localStorage.getItem("vibe_api_key")?.trim();
    const provider = localStorage.getItem("vibe_api_provider");

    if (!apiKey || !provider) {
      setError("No API key found. Click ⚙️ in the navbar to add your key.");
      window.dispatchEvent(new CustomEvent('vibe:openSettings'));
      return;
    }

    if (!isRetry && lastInputRef.current !== formData.prompt) {
      setRetryCount(0);
      lastInputRef.current = formData.prompt;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    abortControllerRef.current = new AbortController();

    try {
      let userMsg = `Please improve this prompt and teach me why:\n\n${formData.prompt}`;
      
      // Step 2 Retry: Add forceful instruction
      if (retryCount === 1) {
        userMsg += `\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the JSON object, nothing else.`;
      }
      
      // Step 3 Retry: (Logic handled by asking for simpler schema in prompt if needed, 
      // but here we just try one more time before fallback)

      const response = await fetch('/api/prompt-optimizer', {
        method: 'POST',
        signal: abortControllerRef.current.signal,
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-api-provider': provider,
        },
        body: JSON.stringify({
          ...formData,
          prompt: formData.prompt, // Ensure we use the latest prompt
          bibleContext: formattedContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('vibe:openSettings'));
        }
        const errorData = data as ApiError;
        throw new Error(errorData.error || errorData.message || 'Failed to optimize');
      }

      const { data: parsed, error: parseError } = parseStructuredOutput<PromptOptimizerResult>(data.data);

      if (parseError) {
        if (retryCount < 2) {
          const nextRetry = retryCount + 1;
          setRetryCount(nextRetry);
          setLoading(false);
          // Small delay before retry
          setTimeout(() => handleSubmit(formData, true), 500);
          return;
        } else {
          throw new Error("VIBE is having trouble with this input. Try rephrasing it.");
        }
      }

      setResult(parsed);
      setRetryCount(0);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#FFFBF0]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-16">
        {incomingBanner && (
          <div className="mb-8 p-4 bg-[#FFE135] border-[3px] border-black shadow-[4px_4px_0px_#000] font-[900] uppercase text-xs flex justify-between items-center animate-fade-in">
             <div className="flex items-center gap-3">
               <span className="text-xl">✓</span>
               Received output from {incomingBanner} — ready to run
             </div>
             <button onClick={() => setIncomingBanner(null)} className="hover:scale-110 transition-transform">✕</button>
          </div>
        )}

        <div className="mb-16 animate-fade-in border-l-[8px] border-black pl-8 py-2">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 border-[3px] border-black bg-[#FFE135] shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl">
              <OptimizerIcon className="w-8 h-8" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase">Prompt Optimizer</h1>
          </div>
          <p className="text-xl font-bold max-w-2xl mt-4 opacity-60">
            Don't just get a better prompt. <span className="bg-[#FFE135] px-2">Become a better writer.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="nb-card p-10 bg-white">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Draft Your Prompt</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel={loading ? (retryCount > 0 ? `Refining Analysis (${retryCount})...` : "Analyzing...") : "Analyze & Optimize"}
              initialData={initialData}
            />
            {loading && (
              <button 
                onClick={handleCancel}
                className="w-full mt-4 text-[10px] font-black uppercase text-rose-500 hover:underline tracking-widest"
              >
                Cancel Analysis
              </button>
            )}
          </div>

          <div className="min-h-[400px] flex flex-col">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40">
                <span className="text-5xl mb-4">🎓</span>
                <p className="font-black uppercase tracking-widest text-sm text-center">Ready for your prompt engineering lesson?</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-[4px] border-black border-t-[#FFE135] animate-spin mb-4"></div>
                <p className="font-black uppercase tracking-widest text-sm">Professor AI is grading your prompt...</p>
                {retryCount > 0 && <p className="text-[10px] font-black uppercase mt-2 opacity-40 animate-pulse">Ensuring structured feedback...</p>}
              </div>
            )}

            {result && <PromptOptimizerCard result={result} />}

            {error && (
              <div className="mt-8 p-6 bg-[#FF6B6B]/10 border-[3px] border-[#FF6B6B] text-rose-600 font-black uppercase text-xs tracking-widest leading-relaxed animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">⚠️</span>
                  <span className="text-[10px] opacity-60">Error Encountered</span>
                </div>
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}