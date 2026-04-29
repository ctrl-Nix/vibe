'use client';

import React, { useState } from 'react';
import { PromptOptimizerResult } from '@/types';
import { SendToButton } from '@/components/SendToButton';

interface PromptOptimizerCardProps {
  result: PromptOptimizerResult;
}

export const PromptOptimizerCard: React.FC<PromptOptimizerCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);

  const copyAsText = () => {
    const changesText = result.changes.map((c, i) => `${i + 1}. ${c.what}: ${c.why}`).join('\n');
    const text = `PROMPT OPTIMIZATION
BEFORE: ${result.score_before}/10
AFTER: ${result.score_after}/10

OPTIMIZED PROMPT:
${result.optimized}

CHANGES:
${changesText}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOptimized = () => {
    navigator.clipboard.writeText(result.optimized);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  return (
    <div className="nb-card bg-white p-8 animate-fade-in relative">
      <button 
        onClick={copyAsText}
        className="absolute top-4 right-4 text-[10px] font-black uppercase underline hover:text-[#FF6B6B] transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy as text'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Original Prompt</h3>
            <span className="text-[10px] font-black uppercase">Score: {result.score_before}/10</span>
          </div>
          <div className="nb-card bg-black/5 p-6 min-h-[120px] opacity-40">
            <p className="text-xs font-bold leading-relaxed line-clamp-6">{result.original}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#4ECDC4]">Optimized Prompt</h3>
            <span className="text-[10px] font-black uppercase">Score: {result.score_after}/10</span>
          </div>
          <div className="nb-card bg-[#FFFBF0] p-6 min-h-[120px] relative group border-2 border-black">
            <button 
              onClick={copyOptimized}
              className="absolute top-2 right-2 bg-black text-white text-[8px] font-black uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedMain ? 'Copied ✓' : 'Copy'}
            </button>
            <p className="text-sm font-[900] leading-relaxed uppercase">{result.optimized}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">
          What Changed
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.changes.map((change, i) => (
            <div key={i} className="flex gap-4 items-start bg-black/5 p-4 border-2 border-black">
              <span className="bg-black text-white text-[10px] font-black w-6 h-6 flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-black uppercase mb-1">{change.what}</p>
                <p className="text-xs font-bold opacity-60 leading-relaxed">{change.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <SendToButton 
          sourceToolId="prompt-optimizer" 
          content={result.optimized} 
        />
      </div>
    </div>
  );
};
