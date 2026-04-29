// File location: src/app/tools/oracle/page.tsx
// Oracle tool page (Neobrutalism + BYOK)

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { OracleResponse, ApiError } from '@/types';
import { useBible } from '@/hooks/useBible';
import { useApiKey } from '@/hooks/useApiKey';

export default function OraclePage() {
  const [result, setResult] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formattedContext } = useBible();
  const { apiKey, provider } = useApiKey();

  const fields: FormField[] = [
    {
      name: 'topic',
      label: 'What do you need help with?',
      type: 'text',
      placeholder: 'e.g., A detective who solves crimes across time',
      required: true,
    },
    {
      name: 'type',
      label: 'Type of Help',
      type: 'select',
      options: [
        { value: 'character', label: '🎭 Character Development' },
        { value: 'plot', label: '📖 Plot & Story Ideas' },
        { value: 'dialogue', label: '💬 Dialogue & Conversations' },
        { value: 'worldbuilding', label: '🌍 World Building' },
        { value: 'general', label: '💡 General Brainstorming' },
      ],
      required: true,
    },
    {
      name: 'style',
      label: 'Style/Tone (Optional)',
      type: 'text',
      placeholder: 'e.g., dark and mysterious',
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/oracle', {
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
        throw new Error(errorData.message || 'Failed to generate ideas');
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
            <div className="w-16 h-16 border-[3px] border-black bg-[#4ECDC4] shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl">
              🔮
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Oracle</h1>
          </div>
          <p className="text-xl font-medium max-w-2xl border-l-[6px] border-black pl-6">
            Get creative brainstorming ideas for your writing. Unleash the infinite possibilities of AI.
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
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Consult the Oracle</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Generate Ideas"
            />
          </div>

          <div className="nb-card p-10 bg-white">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Generated Ideas</h2>
            
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40">
                <span className="text-5xl mb-4">💡</span>
                <p className="font-black uppercase tracking-widest text-sm">Waiting for inspiration</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-[4px] border-black border-t-[#4ECDC4] animate-spin mb-4"></div>
                <p className="font-black uppercase tracking-widest text-sm">Summoning creative energy...</p>
              </div>
            )}

            {result && (
              <div className="space-y-10 animate-fade-in">
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#FFE135] border-[2px] border-black px-3 py-1 inline-block">Core Ideas</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {result.ideas.map((idea, i) => (
                        <div key={i} className="nb-card p-6 bg-[#FFFBF0] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all">
                          <p className="font-bold text-lg leading-snug">{idea}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#4ECDC4] border-[2px] border-black px-3 py-1 inline-block">Pro Suggestions</h3>
                    <div className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="bg-white border-[2px] border-black p-4 font-bold text-xs shadow-[2px_2px_0px_#000]">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-[#FF6B6B] border-[2px] border-black px-3 py-1 inline-block">Quick Tips</h3>
                    <div className="space-y-2">
                      {result.tips.map((t, i) => (
                        <div key={i} className="flex gap-3 items-center bg-white border-[2px] border-black p-4 font-bold text-xs shadow-[2px_2px_0px_#000]">
                          <span className="text-lg">✦</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ResultDisplay result={result.examples} title="Implementation Examples" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}