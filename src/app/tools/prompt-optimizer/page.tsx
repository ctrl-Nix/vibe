// File location: src/app/tools/prompt-optimizer/page.tsx
// Prompt Optimizer tool page

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputForm, { FormField, FormData } from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import { PromptOptimizerResponse, ApiError } from '@/types';

export default function PromptOptimizerPage() {
  const [result, setResult] = useState<PromptOptimizerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">✨</span>
            <h1 className="text-4xl font-bold text-gray-900">Prompt Optimizer</h1>
          </div>
          <p className="text-gray-600 text-lg">Improve your prompts to get better AI results.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700"><strong>Error:</strong> {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paste Your Prompt</h2>
            <InputForm
              fields={fields}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Optimize"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Optimized Prompt</h2>
            {!result && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Submit a prompt to see improvements</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <svg className="w-12 h-12 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Original Prompt:</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">{result.originalPrompt}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-2xl text-cyan-600">↓</div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Optimized Prompt:</h3>
                  <div className="bg-cyan-50 p-4 rounded-lg border-2 border-cyan-500">
                    <p className="text-gray-800 text-sm font-medium">{result.optimizedPrompt}</p>
                  </div>
                </div>

                {result.improvements && result.improvements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-900 mb-3">✅ Improvements Made</h3>
                    <ul className="space-y-2">
                      {result.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.tips && result.tips.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-blue-500 mt-1">→</span>
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