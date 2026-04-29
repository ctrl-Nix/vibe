'use client';

import React, { useState } from 'react';
import { OracleResult } from '@/types';
import { SendToButton } from '@/components/SendToButton';

interface OracleCardProps {
  result: OracleResult;
}

export const OracleCard: React.FC<OracleCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyAsText = () => {
    const text = result.ideas.map((idea, i) => 
      `IDEA ${i + 1}: ${idea.title}\n${idea.description}\nTwist: ${idea.twist}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bgColors = ['bg-[#FFFBF0]', 'bg-[#FFE135]', 'bg-[#FFFBF0]'];

  return (
    <div className="nb-card bg-white p-8 animate-fade-in relative">
      <button 
        onClick={copyAsText}
        className="absolute top-4 right-4 text-[10px] font-black uppercase underline hover:text-[#FF6B6B] transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy as text'}
      </button>

      <h2 className="text-xl font-black mb-8 uppercase tracking-widest border-b-[3px] border-black pb-2 inline-block">
        Consultation Results
      </h2>

      <div className="flex flex-col gap-6">
        {result.ideas.map((idea, i) => (
          <div 
            key={i} 
            className={`nb-card ${bgColors[i % 3]} p-6 shadow-[4px_4px_0px_#000] border-2 border-black`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Idea {i + 1}</span>
            </div>
            <h3 className="text-lg font-[900] uppercase tracking-tight mb-3 leading-tight">{idea.title}</h3>
            <p className="text-sm font-bold opacity-70 leading-relaxed mb-4">{idea.description}</p>
            <div className="flex items-start gap-2 bg-white/50 p-3 border-2 border-black border-dashed">
              <span className="text-lg">💡</span>
              <p className="text-xs font-black italic leading-snug">
                <span className="uppercase tracking-widest opacity-40 block mb-1">Twist</span>
                {idea.twist}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <SendToButton 
          sourceToolId="oracle" 
          content={result.ideas.map(i => `${i.title}: ${i.description}`).join('\n\n')} 
        />
      </div>
    </div>
  );
};
