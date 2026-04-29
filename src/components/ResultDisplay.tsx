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
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">{title}</h3>
        <button
          onClick={handleCopy}
          className={`nb-badge transition-all py-1 px-3 ${
            copied ? 'bg-[#4ECDC4]' : 'bg-[#FFE135] hover:bg-white'
          }`}
        >
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-6 max-h-[32rem] overflow-y-auto custom-scrollbar">
        <div className="text-black whitespace-pre-wrap text-sm leading-relaxed font-medium">
          {resultText}
        </div>
      </div>
    </div>
  );
}