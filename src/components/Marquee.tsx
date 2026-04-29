'use client';

import React from 'react';

const ITEMS = [
  'Visualize',
  'Ideate',
  'Build',
  'Express',
  'Neobrutalism',
  'AI-Powered',
  'Creative Writing',
  'BYOK Architecture',
  'Workflow Chain',
];

export const Marquee: React.FC = () => {
  // Duplicate items to create a seamless loop
  const listItems = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative w-full overflow-hidden border-y-[3px] border-black bg-white py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {listItems.map((item, i) => (
          <div key={i} className="flex items-center mx-6">
            <span className="text-xl font-black uppercase tracking-tighter text-black">
              {item}
            </span>
            <span className="ml-12 text-[#FFE135] text-2xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
