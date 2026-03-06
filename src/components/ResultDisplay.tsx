// File location: src/components/ResultDisplay.tsx
// Display results component

'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  result: string | Record<string, any>;
  title?: string;
}

export default function ResultDisplay({
  result,
  title = 'Result',
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resultText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="text-gray-700 whitespace-pre-wrap text-sm">
          {resultText}
        </div>
      </div>
    </div>
  );
}