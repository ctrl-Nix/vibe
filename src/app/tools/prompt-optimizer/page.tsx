// File location: src/app/tools/prompt-optimizer/page.tsx
// Prompt Optimizer tool page (Neobrutalism + BYOK)

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { PromptOptimizerResponse, ApiError } from '@/types';
import { useBible } from '@/hooks/useBible';
import { useApiKey } from '@/hooks/useApiKey';

export default function PromptOptimizerPage() {
  const [result, setResult] = useState<PromptOptimizerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formattedContext } = useBible();
  const { apiKey, provider } = useApiKey();

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

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/prompt-optimizer', {
        method: 'POST',
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
        const errorData = data as ApiError;
        throw new Error(errorData.message || 'Failed to optimize');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 border-[3px] border-black bg-[#FFE135] shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl">
              ✨
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Prompt Optimizer</h1>
          </div>
          <p className="text-xl font-medium max-w-2xl border-l-[6px] border-black pl-6">
            Improve your prompts to get better AI results. Precision engineering for the creative mind.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-[#FF6B6B] border-[3px] border-black shadow-[4px_4px_0px_#000] font-bold uppercase text-sm flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="nb-card p-10 bg-white">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Draft Your Prompt</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Optimize Prompt"
            />
          </div>

          <div className="nb-card p-10 bg-white">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Refined Instructions</h2>
            
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40">
                <span className="text-5xl mb-4">🪄</span>
                <p className="font-black uppercase tracking-widest text-sm">Waiting for the spark</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-[4px] border-black border-t-[#FFE135] animate-spin mb-4"></div>
                <p className="font-black uppercase tracking-widest text-sm">Fine-tuning neurons...</p>
              </div>
            )}

            {result && (
              <div className="space-y-10 animate-fade-in">
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#FFE135] border-[2px] border-black px-3 py-1 inline-block">The Optimized Prompt</h3>
                   <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_#000] relative group">
                      <button 
                        onClick={() => navigator.clipboard.writeText(result.optimizedPrompt)}
                        className="absolute top-4 right-4 bg-black text-white text-[10px] font-black uppercase px-2 py-1 hover:bg-[#FFE135] hover:text-black transition-colors"
                      >
                        Copy
                      </button>
                      <p className="font-bold text-base leading-relaxed">{result.optimizedPrompt}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#4ECDC4] border-[2px] border-black px-3 py-1 inline-block">Improvements Applied</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.improvements.map((im, i) => (
                        <div key={i} className="flex gap-4 items-center bg-[#FFFBF0] border-[2px] border-black p-3 font-bold text-xs shadow-[2px_2px_0px_#000]">
                          <span className="w-4 h-4 bg-black text-white flex items-center justify-center text-[10px]">✓</span>
                          {im}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#FF6B6B] border-[2px] border-black px-3 py-1 inline-block">Pro Prompting Tips</h3>
                    <div className="space-y-2">
                      {result.tips.map((t, i) => (
                        <div key={i} className="flex gap-4 items-center bg-white border-[2px] border-black p-4 font-bold text-xs shadow-[2px_2px_0px_#000]">
                          <span className="text-xl">💡</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFBF0] border-[3px] border-black p-6">
                   <h3 className="text-xs font-black uppercase tracking-widest mb-3 border-b-[2px] border-black pb-1 inline-block">Optimization Strategy</h3>
                   <p className="text-sm font-medium italic opacity-70">"{result.explanation}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}