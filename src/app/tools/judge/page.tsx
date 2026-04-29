// File location: src/app/tools/judge/page.tsx
// Judge tool page (Neobrutalism + BYOK)

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { JudgeResponse, ApiError } from '@/types';
import { useBible } from '@/hooks/useBible';
import { useApiKey } from '@/hooks/useApiKey';

export default function JudgePage() {
  const [result, setResult] = useState<JudgeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formattedContext } = useBible();
  const { apiKey, provider } = useApiKey();

  const fields: FormField[] = [
    {
      name: 'text',
      label: 'Your Writing',
      type: 'textarea',
      placeholder: 'Paste your writing sample here...',
      required: true,
      rows: 8,
    },
    {
      name: 'genre',
      label: 'Genre (Optional)',
      type: 'select',
      options: [
        { value: '', label: 'Select a genre' },
        { value: 'fiction', label: 'Fiction' },
        { value: 'essay', label: 'Essay' },
        { value: 'poetry', label: 'Poetry' },
        { value: 'academic', label: 'Academic' },
      ],
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/judge', {
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
        throw new Error(errorData.message || 'Failed to get feedback');
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
              ⭐
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Judge</h1>
          </div>
          <p className="text-xl font-medium max-w-2xl border-l-[6px] border-black pl-6">
            Get AI feedback on your writing quality. Professional evaluation for serious writers.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-[#FF6B6B] border-[3px] border-black shadow-[4px_4px_0px_#000] font-bold uppercase text-sm flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="nb-card p-10 bg-white">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Submit Writing</h2>
              <InputForm
                fields={fields}
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel="Get Evaluation"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="nb-card p-10 bg-white h-full">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Evaluation Results</h2>
              
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40">
                  <span className="text-5xl mb-4">⚖️</span>
                  <p className="font-black uppercase tracking-widest text-sm">Waiting for submission</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-[4px] border-black border-t-[#FFE135] animate-spin mb-4"></div>
                  <p className="font-black uppercase tracking-widest text-sm">AI is reading...</p>
                </div>
              )}

              {result && (
                <div className="space-y-10 animate-fade-in">
                  <div className="flex items-center gap-8 bg-[#FFE135] p-8 border-[3px] border-black shadow-[4px_4px_0px_#000]">
                    <div className="text-6xl font-black">{result.score}</div>
                    <div className="font-black uppercase tracking-widest leading-none">
                      Overall Writing Score
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: 'Clarity', val: result.detailedAnalysis.clarity, color: 'bg-[#4ECDC4]' },
                      { label: 'Engagement', val: result.detailedAnalysis.engagement, color: 'bg-[#FF6B6B]' },
                      { label: 'Structure', val: result.detailedAnalysis.structure, color: 'bg-white' },
                      { label: 'Grammar', val: result.detailedAnalysis.grammar, color: 'bg-[#FFE135]' },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.color} border-[3px] border-black p-5 shadow-[4px_4px_0px_#000]`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-3xl font-black">{stat.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest">Strengths</h3>
                    <div className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <div key={i} className="flex gap-4 items-center bg-white border-[2px] border-black p-3 font-bold text-sm">
                          <span className="bg-[#4ECDC4] border-[2px] border-black w-6 h-6 flex items-center justify-center text-[10px]">✓</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest">Improvements</h3>
                    <div className="space-y-2">
                      {result.improvements.map((im, i) => (
                        <div key={i} className="flex gap-4 items-center bg-white border-[2px] border-black p-3 font-bold text-sm">
                          <span className="bg-[#FF6B6B] border-[2px] border-black w-6 h-6 flex items-center justify-center text-[10px]">!</span>
                          {im}
                        </div>
                      ))}
                    </div>
                  </div>

                  <ResultDisplay result={result.feedback} title="Full Critique" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}