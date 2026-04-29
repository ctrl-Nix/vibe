'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ActiveBibleBadge } from './ActiveBibleBadge';
import { ApiKeyModal } from './ApiKeyModal';
import { useApiKey } from '@/hooks/useApiKey';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSaved, provider } = useApiKey();

  useEffect(() => {
    const handleOpenSettings = () => setIsModalOpen(true);
    window.addEventListener('vibe:openSettings', handleOpenSettings);
    return () => window.removeEventListener('vibe:openSettings', handleOpenSettings);
  }, []);

  const tools = [
    { name: 'Judge', path: '/tools/judge', emoji: '⭐' },
    { name: 'Oracle', path: '/tools/oracle', emoji: '🔮' },
    { name: 'Plotline', path: '/tools/plotline', emoji: '📖' },
    { name: 'Prompt Optimizer', path: '/tools/prompt-optimizer', emoji: '✨' },
  ];

  const getProviderInitial = () => {
    if (!provider) return '';
    return provider.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-[#FFE135] border-b-[3px] border-black sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-[900] tracking-tighter text-black uppercase">VIBE</span>
            </Link>
            
            <div className="hidden lg:block">
              <ActiveBibleBadge />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#FFE135] transition-colors"
              >
                {tool.name}
              </Link>
            ))}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 p-2 relative hover:scale-110 transition-transform group"
              title="API Settings"
            >
              <span className="text-xl">⚙️</span>
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-[900] shadow-[2px_2px_0px_#000] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-rose-500'}`}>
                {isSaved ? getProviderInitial() : '!'}
              </div>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 relative"
            >
              <span className="text-xl">⚙️</span>
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-[900] ${isSaved ? 'bg-emerald-500 text-white' : 'bg-rose-500'}`}>
                {isSaved ? getProviderInitial() : '!'}
              </div>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-2 animate-fade-in">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="block px-4 py-3 text-sm font-black uppercase tracking-widest border-2 border-black bg-white shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{tool.emoji}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}