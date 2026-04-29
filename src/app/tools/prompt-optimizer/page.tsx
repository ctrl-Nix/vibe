// File location: src/app/tools/prompt-optimizer/page.tsx
// Prompt Optimizer tool page (Workflow Chain integrated)

'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { SendToButton } from '@/components/SendToButton';
import { PromptOptimizerResponse, ApiError, ToolId } from '@/types';
import { useBible } from '@/hooks/useBible';
import { getWorkflowPayload, isPayloadFresh, clearWorkflowPayload } from '@/lib/workflowStore';

export default function PromptOptimizerPage() {
  const [result, setResult] = useState<PromptOptimizerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<FormData | undefined>(undefined);
  const [incomingBanner, setIncomingBanner] = useState<ToolId | null>(null);
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

  const handleSubmit = async (formData: FormData) => {
    const apiKey = localStorage.getItem("vibe_api_key")?.trim();
    const provider = localStorage.getItem("vibe_api_provider");

    if (!apiKey || !provider) {
      setError("No API key found. Click ⚙️ in the navbar to add your key.");
      window.dispatchEvent(new CustomEvent('vibe:openSettings'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    abortControllerRef.current = new AbortController();

    try {
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

      setResult(data.data);
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

        <div className="mb-16 animate-fade-in">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 border-[3px] border-black bg-[#FFE135] shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl">
              ✨
            </div>
            <h1 className="text-5xl font-[900] tracking-tighter uppercase">Prompt Optimizer</h1>
          </div>
          <p className="text-xl font-bold max-w-2xl border-l-[6px] border-black pl-6 py-1">
            Precision engineering for the creative mind. Bulletproof prompt optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="nb-card p-10 bg-white h-fit">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Draft Your Prompt</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel={loading ? "Optimizing..." : "Optimize Prompt"}
              initialData={initialData}
            />
            {loading && (
              <button 
                onClick={handleCancel}
                className="w-full mt-4 text-[10px] font-black uppercase text-rose-500 hover:underline tracking-widest"
              >
                Cancel Generation
              </button>
            )}
          </div>

          <div className="nb-card p-10 bg-white min-h-[400px] flex flex-col">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Refined Instructions</h2>
            
            <div className="flex-grow flex flex-col">
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40">
                  <span className="text-5xl mb-4">🪄</span>
                  <p className="font-black uppercase tracking-widest text-sm">Waiting for the magic</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-[4px] border-black border-t-[#FFE135] animate-spin mb-4"></div>
                  <p className="font-black uppercase tracking-widest text-sm">Refining Instructions...</p>
                </div>
              )}

              {result && (
                <div className="space-y-10 animate-fade-in">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#FFE135] border-[2px] border-black px-3 py-1 inline-block">The Optimized Prompt</h3>
                    <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_#000] relative group">
                        <button 
                          onClick={() => navigator.clipboard.writeText(result.optimizedPrompt)}
                          className="absolute top-4 right-4 bg-black text-white text-[10px] font-[900] uppercase px-3 py-1 hover:bg-[#FFE135] hover:text-black transition-colors border-2 border-black"
                        >
                          Copy
                        </button>
                        <p className="font-black text-base leading-relaxed uppercase">{result.optimizedPrompt}</p>
                    </div>
                  </div>
                  <ResultDisplay result={result.improvements} title="Improvements Applied" />
                  
                  <SendToButton 
                    sourceToolId="prompt-optimizer" 
                    content={result.optimizedPrompt} 
                  />
                </div>
              )}
            </div>

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