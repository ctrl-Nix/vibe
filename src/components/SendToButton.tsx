'use client';

import { useRouter } from 'next/navigation';
import { ToolId, WORKFLOW_ROUTES } from '@/types';
import { setWorkflowPayload } from '@/lib/workflowStore';
import { useBible } from '@/hooks/useBible';

interface SendToButtonProps {
  sourceToolId: ToolId;
  content: string;
}

export const SendToButton: React.FC<SendToButtonProps> = ({ sourceToolId, content }) => {
  const router = useRouter();
  const { formattedContext } = useBible();
  const targets = WORKFLOW_ROUTES[sourceToolId];

  const handleSend = (target: ToolId) => {
    setWorkflowPayload({
      sourceToolId,
      content,
      bibleContext: formattedContext,
      timestamp: Date.now(),
    });
    router.push(`/tools/${target}`);
  };

  const getToolDisplayName = (id: ToolId) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="mt-8 pt-8 border-t-[3px] border-black animate-fade-in">
      <p className="text-[10px] font-[900] uppercase tracking-[0.3em] mb-4 text-black/40">
        Chain your workflow:
      </p>
      <div className="flex flex-wrap gap-4">
        {targets.map((target) => (
          <button
            key={target}
            onClick={() => handleSend(target)}
            className="nb-button bg-[#FFE135] py-3 px-6 text-xs flex items-center gap-2 group"
          >
            Send to {getToolDisplayName(target)}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};
