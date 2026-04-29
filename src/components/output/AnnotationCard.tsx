'use client';

import React from 'react';
import { PromptAnnotation } from '@/types';
import { PRINCIPLE_COLORS } from './PromptDiff';

interface AnnotationCardProps {
  annotation: PromptAnnotation;
  index: number;
}

export const AnnotationCard: React.FC<AnnotationCardProps> = ({ annotation, index }) => {
  const color = PRINCIPLE_COLORS[annotation.principle];

  return (
    <div 
      id={annotation.id}
      className="nb-card bg-white p-8 transition-transform duration-200 scroll-mt-24"
      style={{ borderLeft: `8px solid ${color}` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000] bg-white">
            {index + 1}
          </div>
          <span className="nb-badge bg-black text-white py-1 px-3 text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: color, color: 'black' }}>
            {annotation.principle.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2">The Problem</h4>
          <p className="text-sm font-bold opacity-40 italic mb-2">"{annotation.original_fragment}"</p>
          <p className="text-sm font-bold leading-relaxed">{annotation.issue}</p>
        </div>

        <div className="pt-4 border-t-2 border-black/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#4ECDC4] mb-2">The Fix</h4>
          <p className="text-sm font-bold leading-relaxed">{annotation.fix}</p>
        </div>
      </div>
    </div>
  );
};
