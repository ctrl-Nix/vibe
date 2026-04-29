'use client';

import React, { useState, useEffect } from 'react';
import { PromptOptimizerResult } from '@/types';
import { SendToButton } from '@/components/SendToButton';
import { PromptDiff } from './PromptDiff';
import { AnnotationCard } from './AnnotationCard';
import { PrincipleScore } from './PrincipleScore';

interface PromptOptimizerCardProps {
  result: PromptOptimizerResult;
}

export const PromptOptimizerCard: React.FC<PromptOptimizerCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);
  const [visibleSections, setVisibleSections] = useState<number>(0);

  useEffect(() => {
    const timers = [0, 150, 300, 450, 600, 750].map((delay, i) => 
      setTimeout(() => setVisibleSections(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const copyAsText = () => {
    const annotationsText = result.annotations.map((a, i) => 
      `${i + 1}. ${a.principle.toUpperCase()} [${a.original_fragment}]: ${a.issue} -> ${a.fix}`
    ).join('\n');
    
    const text = `PROMPT OPTIMIZATION & LESSON
SUMMARY: ${result.lesson_summary}

SCORE: ${result.score_before}/10 -> ${result.score_after}/10

OPTIMIZED PROMPT:
${result.optimized}

ANNOTATIONS:
${annotationsText}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOptimized = () => {
    navigator.clipboard.writeText(result.optimized);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const staggerClass = (index: number) => `
    transition-all duration-500 ease-out 
    ${visibleSections > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
  `;

  return (
    <div className="space-y-12 animate-fade-in relative pb-10">
      <button 
        onClick={copyAsText}
        className="absolute top-0 right-0 text-[10px] font-black uppercase underline hover:text-[#FF6B6B] transition-colors z-10"
      >
        {copied ? 'Copied ✓' : 'Copy Full Lesson'}
      </button>

      {/* 1. Lesson Summary Banner */}
      <div className={staggerClass(0)}>
        <div className="bg-[#FFE135] border-[3px] border-black p-8 shadow-[6px_6px_0px_#000] flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60 text-black">Today's Lesson</p>
            <p className="text-xl font-black leading-tight uppercase">"{result.lesson_summary}"</p>
          </div>
        </div>
      </div>

      {/* 2. Before / After Score */}
      <div className={staggerClass(1)}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 bg-white p-12 nb-card">
          <div className="text-center opacity-40">
            <p className="text-xs font-black uppercase tracking-widest mb-4">Before</p>
            <p className="text-6xl font-black mb-4">{result.score_before}<span className="text-2xl">/10</span></p>
            <div className="h-2 w-32 bg-black/10 border-2 border-black">
              <div className="h-full bg-black" style={{ width: `${result.score_before * 10}%` }}></div>
            </div>
          </div>
          
          <div className="text-4xl font-black hidden sm:block">→</div>
          <div className="text-4xl font-black block sm:hidden">↓</div>

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest mb-4">After</p>
            <p className="text-8xl font-black mb-4 text-emerald-500 drop-shadow-[4px_4px_0px_#000]">{result.score_after}<span className="text-3xl text-black">/10</span></p>
            <div className="h-3 w-48 bg-[#FFE135]/20 border-2 border-black">
              <div className="h-full bg-[#FFE135]" style={{ width: `${result.score_after * 10}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Annotated Diff */}
      <div className={staggerClass(2)}>
        <PromptDiff original={result.original} annotations={result.annotations} />
      </div>

      {/* 4. Annotation Cards */}
      <div className={`${staggerClass(3)} space-y-6`}>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Deep Dive Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.annotations.map((anno, i) => (
            <AnnotationCard key={anno.id} annotation={anno} index={i} />
          ))}
        </div>
      </div>

      {/* 5. Principle Score Card */}
      <div className={staggerClass(4)}>
        <PrincipleScore counts={result.principle_counts} />
      </div>

      {/* 6. Optimized Prompt */}
      <div className={staggerClass(5)}>
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">The Final Masterpiece</h3>
          <div className="nb-card bg-[#FFFBF0] p-10 relative group border-[4px] border-black shadow-[8px_8px_0px_#000]">
            <button 
              onClick={copyOptimized}
              className="absolute top-6 right-6 bg-black text-white text-[10px] font-black uppercase px-4 py-2 hover:bg-[#FFE135] hover:text-black transition-colors border-2 border-black"
            >
              {copiedMain ? 'Copied ✓' : 'Copy Prompt'}
            </button>
            <p className="text-2xl font-[900] leading-tight uppercase pr-20">{result.optimized}</p>
          </div>
        </div>
      </div>

      {/* 7. SendToButton */}
      <div className={staggerClass(6)}>
        <SendToButton 
          sourceToolId="prompt-optimizer" 
          content={result.optimized} 
        />
      </div>
    </div>
  );
};
