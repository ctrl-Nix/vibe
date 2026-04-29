'use client';

import React from 'react';
import { useBible } from '@/hooks/useBible';
import { PlotlineIcon } from './Icons';

export const ActiveBibleBadge: React.FC = () => {
  const { bible, formattedContext } = useBible();

  if (!formattedContext) {
    return (
      <div className="nb-badge bg-[#FF6B6B] text-black flex items-center gap-2">
        <PlotlineIcon className="w-3 h-3" />
        <span>No story set</span>
      </div>
    );
  }

  return (
    <div className="nb-badge bg-[#4ECDC4] text-black flex items-center gap-2">
      <PlotlineIcon className="w-4 h-4" />
      <span className="tracking-tight">{bible.title}</span>
    </div>
  );
};
