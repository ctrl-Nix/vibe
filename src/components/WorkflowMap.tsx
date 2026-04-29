'use client';

import Link from 'next/link';
import { ToolId, WORKFLOW_ROUTES } from '@/types';

export const WorkflowMap = () => {
  const tools: { id: ToolId; name: string; color: string }[] = [
    { id: 'oracle', name: 'Oracle', color: 'bg-[#4ECDC4]' },
    { id: 'plotline', name: 'Plotline', color: 'bg-[#FF6B6B]' },
    { id: 'judge', name: 'Judge', color: 'bg-[#FFE135]' },
    { id: 'prompt-optimizer', name: 'Optimizer', color: 'bg-white' },
  ];

  return (
    <div className="nb-card bg-white p-12 mt-20">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-3xl font-[900] uppercase tracking-tighter bg-black text-white px-4 py-1">Workflow Map</h2>
        <div className="h-[3px] flex-grow bg-black"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {tools.map((tool) => (
          <div key={tool.id} className="relative group">
            <Link href={`/tools/${tool.id}`}>
              <div className={`nb-card ${tool.color} p-8 flex flex-col items-center text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all cursor-pointer`}>
                <h3 className="font-[900] uppercase text-base tracking-widest">{tool.name}</h3>
              </div>
            </Link>

            {/* Arrows to targets */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {WORKFLOW_ROUTES[tool.id].map((targetId) => (
                <div 
                  key={targetId} 
                  className="text-[8px] font-black uppercase bg-black text-white px-2 py-0.5"
                  title={`Flows to ${targetId}`}
                >
                  → {targetId.split('-')[0]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-12 text-center text-xs font-black uppercase tracking-[0.2em] opacity-40">
        Chain tools together to build your story from seed to masterpiece
      </p>
    </div>
  );
};
