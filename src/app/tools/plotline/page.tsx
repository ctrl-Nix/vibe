// File location: src/app/tools/plotline/page.tsx
// Plotline tool page (Neobrutalism + BYOK)

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { PlotlineResponse, ApiError } from '@/types';
import { useBible } from '@/hooks/useBible';
import { useApiKey } from '@/hooks/useApiKey';

export default function PlotlinePage() {
  const [result, setResult] = useState<PlotlineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formattedContext } = useBible();
  const { apiKey, provider } = useApiKey();

  const fields: FormField[] = [
    {
      name: 'concept',
      label: 'Story Concept',
      type: 'textarea',
      placeholder: 'Describe your story idea...',
      required: true,
      rows: 4,
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'select',
      options: [
        { value: '', label: 'Select a genre' },
        { value: 'fantasy', label: '⚔️ Fantasy' },
        { value: 'sci-fi', label: '🚀 Science Fiction' },
        { value: 'mystery', label: '🔍 Mystery' },
        { value: 'romance', label: '💕 Romance' },
        { value: 'thriller', label: '⚡ Thriller' },
      ],
      required: true,
    },
    {
      name: 'characters',
      label: 'Main Characters (Optional)',
      type: 'text',
      placeholder: 'e.g., Emma, David, The Shadow',
    },
    {
      name: 'setting',
      label: 'Setting (Optional)',
      type: 'text',
      placeholder: 'e.g., Modern London with a magical hidden world',
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/plotline', {
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
        throw new Error(errorData.message || 'Failed to generate plot');
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
            <div className="w-16 h-16 border-[3px] border-black bg-[#FF6B6B] shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl">
              📖
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Plotline</h1>
          </div>
          <p className="text-xl font-medium max-w-2xl border-l-[6px] border-black pl-6">
            Generate a complete story structure with acts and chapters. Build the skeleton of your masterpiece.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-[#FF6B6B] border-[3px] border-black shadow-[4px_4px_0px_#000] font-bold uppercase text-sm flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            {error}
          </div>
        )}

        <div className="nb-card p-10 bg-white mb-16">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">Architect Your Story</h2>
          <InputForm
            fields={fields}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Generate Story Structure"
          />
        </div>

        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-64 border-[3px] border-black border-dashed opacity-40 mb-12">
            <span className="text-5xl mb-4">📜</span>
            <p className="font-black uppercase tracking-widest text-sm">Awaiting your vision</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 mb-12">
            <div className="w-16 h-16 border-[4px] border-black border-t-[#FF6B6B] animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-widest text-sm">Weaving the threads...</p>
          </div>
        )}

        {result && (
          <div className="space-y-12 animate-fade-in">
             <div className="bg-[#FFE135] border-[3px] border-black p-10 shadow-[6px_6px_0px_#000]">
                <h2 className="text-4xl font-black mb-6 tracking-tighter">{result.title}</h2>
                <div className="bg-white border-[2px] border-black p-6 font-bold text-lg italic shadow-[4px_4px_0px_#000]">
                  "{result.logline}"
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {result.plotPoints.map((point) => (
                  <div key={point.act} className="nb-card bg-white p-8 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-black text-white font-black flex items-center justify-center text-xl">
                        {point.act}
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight leading-none">{point.title}</h3>
                    </div>
                    <p className="font-medium text-sm leading-relaxed mb-8 flex-grow">{point.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block">Key Beats</h4>
                      <ul className="space-y-2">
                        {point.keyEvents.map((e, i) => (
                          <li key={i} className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-tight">
                            <span className="w-2 h-2 bg-[#FF6B6B] border border-black shrink-0"></span>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="nb-card p-8 bg-[#4ECDC4]">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-[2px] border-black pb-1 inline-block">Thematic Resonance</h3>
                  <div className="flex flex-wrap gap-3">
                    {result.themes.map((t, i) => (
                      <span key={i} className="bg-white border-[2px] border-black px-4 py-2 font-black uppercase text-xs shadow-[2px_2px_0px_#000]">
                        {t}
                      </span>
                    ))}
                  </div>
               </div>

               <div className="nb-card p-8 bg-[#FFE135]">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-[2px] border-black pb-1 inline-block">Character Development</h3>
                  <div className="space-y-4">
                    {result.characterArcs.map((c, i) => (
                      <div key={i} className="bg-white border-[2px] border-black p-4 shadow-[2px_2px_0px_#000]">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">{c.name}</p>
                        <p className="font-bold text-sm">{c.arc}</p>
                      </div>
                    ))}
                  </div>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}