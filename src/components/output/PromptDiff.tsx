'use client';

import React from 'react';
import { PromptAnnotation, PromptPrinciple } from '@/types';

interface PromptDiffProps {
  original: string;
  annotations: PromptAnnotation[];
}

export const PRINCIPLE_COLORS: Record<PromptPrinciple, string> = {
  'be-specific': '#FF6B6B',
  'add-context': '#FFE135',
  'define-output': '#4ECDC4',
  'set-constraints': '#C0DD97',
  'show-example': '#AFA9EC',
  'reduce-ambiguity': '#FAC775',
  'add-role': '#F0997B',
};

export const PromptDiff: React.FC<PromptDiffProps> = ({ original, annotations }) => {
  // Sort annotations by their position in the text to handle sequential wrapping
  const sortedAnnotations = [...annotations]
    .filter(a => original.includes(a.original_fragment))
    .sort((a, b) => original.indexOf(a.original_fragment) - original.indexOf(b.original_fragment));

  const renderContent = () => {
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedAnnotations.forEach((anno, index) => {
      const startIndex = original.indexOf(anno.original_fragment, lastIndex);
      
      // If fragment not found (or found before lastIndex due to overlap/duplicates), skip
      if (startIndex === -1 || startIndex < lastIndex) return;

      // Add text before the highlight
      if (startIndex > lastIndex) {
        parts.push(original.substring(lastIndex, startIndex));
      }

      // Add the highlighted fragment
      parts.push(
        <span 
          key={anno.id} 
          className="relative inline-block cursor-pointer group px-0.5"
          style={{ borderBottom: `4px solid ${PRINCIPLE_COLORS[anno.principle]}` }}
          onClick={() => {
            document.getElementById(anno.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Subtle flash effect on targeted card
            const el = document.getElementById(anno.id);
            if (el) {
              el.style.transform = 'scale(1.02)';
              setTimeout(() => el.style.transform = 'scale(1)', 200);
            }
          }}
        >
          <span className="font-black">{anno.original_fragment}</span>
          <span 
            className="absolute -top-3 -right-2 w-5 h-5 flex items-center justify-center rounded-full border-2 border-black bg-white text-[10px] font-black shadow-[1px_1px_0px_#000]"
          >
            {index + 1}
          </span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
            <div className="nb-badge bg-black text-white text-[8px] px-2 py-1 whitespace-nowrap">
              {anno.principle.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        </span>
      );

      lastIndex = startIndex + anno.original_fragment.length;
    });

    // Add remaining text
    if (lastIndex < original.length) {
      parts.push(original.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="nb-card bg-white p-10">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40">Your Prompt (Marked Up)</h3>
      <div className="text-xl font-medium leading-relaxed">
        {renderContent()}
      </div>
    </div>
  );
};
