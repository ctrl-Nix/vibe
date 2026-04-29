'use client';

import React from 'react';
import { useBible } from '@/hooks/useBible';

export const ActiveBibleBadge: React.FC = () => {
  const { bible, formattedContext } = useBible();

  if (!formattedContext) {
    return (
      <div className="nb-badge bg-[#FF6B6B] text-black">
        <span>📖 No story set</span>
      </div>
    );
  }

  return (
    <div className="nb-badge bg-[#4ECDC4] text-black flex items-center gap-2">
      <span className="text-sm">📖</span>
      <span className="tracking-tight">{bible.title}</span>
    </div>
  );
};
