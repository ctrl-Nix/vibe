'use client';

import React, { useState } from 'react';
import { JudgeResult } from '@/types';
import { SendToButton } from '@/components/SendToButton';

interface JudgeCardProps {
  result: JudgeResult;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyAsText = () => {
    const text = `JUDGE VERDICT: ${result.verdict_tag.toUpperCase()}
Score: ${result.score}/10
"${result.verdict}"

STRENGTHS:
${result.strengths.map(s => `• ${s}`).join('\n')}

FIXES NEEDED:
${result.fixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagColors = {
    'needs-work': 'bg-[#FF6B6B]',
    'promising': 'bg-[#FFE135]',
    'strong': 'bg-[#4ECDC4]',
    'excellent': 'bg-[#C0DD97]',
  };

  return (
    <div className="nb-card bg-white p-8 animate-fade-in relative">
      <button 
        onClick={copyAsText}
        className="absolute top-4 right-4 text-[10px] font-black uppercase underline hover:text-[#FF6B6B] transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy as text'}
      </button>

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <span className={`nb-badge ${tagColors[result.verdict_tag]} py-1 px-3 text-[10px] font-black`}>
            {result.verdict_tag.replace('-', ' ')}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Overall Quality</p>
            <p className="text-sm font-black">{result.score}/10</p>
          </div>
          <div className="h-4 w-full bg-black/5 border-2 border-black">
            <div 
              className="h-full bg-black transition-all duration-1000 ease-out" 
              style={{ width: `${(result.score / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xl font-bold italic leading-snug border-l-4 border-black pl-4">
          "{result.verdict}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="text-emerald-500 text-lg">✓</span> Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm font-bold opacity-70 flex gap-2">
                  <span className="text-black">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="text-rose-500 text-lg">✗</span> Fixes Needed
            </h3>
            <ul className="space-y-3">
              {result.fixes.map((f, i) => (
                <li key={i} className="text-sm font-bold opacity-70 flex gap-3">
                  <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <SendToButton 
            sourceToolId="judge" 
            content={`Feedback: ${result.verdict}\n\nStrengths: ${result.strengths.join(', ')}\n\nFixes: ${result.fixes.join(', ')}`} 
          />
        </div>
      </div>
    </div>
  );
};
