'use client';

import React, { useState } from 'react';
import { PlotlineResult } from '@/types';
import { SendToButton } from '@/components/SendToButton';

interface PlotlineCardProps {
  result: PlotlineResult;
}

export const PlotlineCard: React.FC<PlotlineCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyAsText = () => {
    const actsText = result.acts.map(act => 
      `${act.act.toUpperCase()} (${act.label}):\n${act.beats.map(b => `• ${b}`).join('\n')}`
    ).join('\n\n');
    
    const text = `${result.title.toUpperCase()} - ${result.genre.toUpperCase()}\n\n${actsText}\n\nTHEME: ${result.theme}\nHOOK: ${result.hook}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actColors = {
    'Act I': 'bg-[#FFFBF0]',
    'Act II': 'bg-[#FFE135]',
    'Act III': 'bg-[#4ECDC4]',
  };

  return (
    <div className="nb-card bg-white p-8 animate-fade-in relative">
      <button 
        onClick={copyAsText}
        className="absolute top-4 right-4 text-[10px] font-black uppercase underline hover:text-[#FF6B6B] transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy as text'}
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{result.title}</h2>
        <span className="nb-badge bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
          {result.genre}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {result.acts.map((act, i) => (
          <div 
            key={i} 
            className={`nb-card ${actColors[act.act as keyof typeof actColors]} p-6 flex flex-col h-full`}
          >
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 inline-block mb-2">
                {act.act}
              </span>
              <h3 className="text-sm font-black uppercase tracking-tight">{act.label}</h3>
            </div>
            <ul className="space-y-4 flex-grow">
              {act.beats.map((beat, bi) => (
                <li key={bi} className="text-xs font-bold leading-relaxed border-l-2 border-black/20 pl-3">
                  {beat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-6 border-t-[3px] border-black pt-8">
        <div className="flex items-start gap-4">
          <span className="text-2xl">🎯</span>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Theme</p>
             <p className="text-sm font-bold leading-snug">{result.theme}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-2xl">🪝</span>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Hook</p>
             <p className="text-sm font-bold leading-snug">{result.hook}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <SendToButton 
          sourceToolId="plotline" 
          content={result.acts.map(a => `${a.act}: ${a.beats.join(', ')}`).join('\n\n')} 
        />
      </div>
    </div>
  );
};
