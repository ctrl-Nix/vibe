// File location: src/app/tools/oracle/page.tsx
// Oracle tool page

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { OracleResponse, ApiError } from '@/types';

export default function OraclePage() {
  const [result, setResult] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔮</span>
            <h1 className="text-4xl font-bold text-gray-900">Oracle</h1>
          </div>
          <p className="text-gray-600 text-lg">Get creative brainstorming ideas for your writing.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700"><strong>Error:</strong> {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Start Brainstorming</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Generate Ideas"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ideas & Suggestions</h2>
            {!result && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Enter a topic to get creative ideas</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <svg className="w-12 h-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {result.ideas && result.ideas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-purple-900 mb-4">💡 Ideas</h3>
                    <div className="space-y-3">
                      {result.ideas.map((idea, idx) => (
                        <div key={idx} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-gray-800">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.tips && result.tips.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-green-900 mb-4">🎯 Tips</h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}