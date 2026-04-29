'use client';

import React from 'react';
import { PromptPrinciple } from '@/types';
import { PRINCIPLE_COLORS } from './PromptDiff';

interface PrincipleScoreProps {
  counts: Partial<Record<PromptPrinciple, number>>;
}

export const PrincipleScore: React.FC<PrincipleScoreProps> = ({ counts }) => {
  const entries = Object.entries(counts) as [PromptPrinciple, number][];
  if (entries.length === 0) return null;

  const maxCount = Math.max(...entries.map(([_, count]) => count));

  const getDisplayName = (slug: string) => {
    return slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="nb-card bg-white p-10">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Your Weak Spots</h3>
      
      <div className="space-y-6">
        {entries.sort((a, b) => b[1] - a[1]).map(([principle, count]) => (
          <div key={principle} className="space-y-2">
            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
              <span>{getDisplayName(principle)}</span>
              <span className="opacity-40">{count} issue{count > 1 ? 's' : ''}</span>
            </div>
            <div className="h-4 w-full bg-[#F1EFE8] border-2 border-black overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  backgroundColor: PRINCIPLE_COLORS[principle],
                  width: `${(count / maxCount) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
