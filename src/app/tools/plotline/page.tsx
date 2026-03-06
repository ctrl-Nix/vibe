// File location: src/app/tools/plotline/page.tsx
// Plotline tool page

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { PlotlineResponse, ApiError } from '@/types';

export default function PlotlinePage() {
  const [result, setResult] = useState<PlotlineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📖</span>
            <h1 className="text-4xl font-bold text-gray-900">Plotline</h1>
          </div>
          <p className="text-gray-600 text-lg">Generate a complete story structure with acts and chapters.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700"><strong>Error:</strong> {error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Your Plot</h2>
          <InputForm
            fields={fields}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Generate Plot"
          />
        </div>

        {!result && !loading && (
          <div className="bg-amber-100 border border-amber-200 rounded-lg p-12 text-center">
            <p className="text-lg text-amber-900">Enter your story concept to generate a plot</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <svg className="w-12 h-12 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.title}</h2>
              <p className="text-gray-600 italic text-lg border-l-4 border-amber-500 pl-4">
                {result.logline}
              </p>
            </div>

            {result.plotPoints.map((point) => (
              <div key={point.act} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                    {point.act}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{point.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{point.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Events:</h4>
                  <ul className="space-y-2">
                    {point.keyEvents.map((event, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-amber-500 mt-1">→</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}