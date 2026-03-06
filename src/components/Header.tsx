// File location: src/components/Header.tsx
// Navigation header component

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { name: 'Judge', path: '/tools/judge', emoji: '⭐' },
    { name: 'Oracle', path: '/tools/oracle', emoji: '🔮' },
    { name: 'Plotline', path: '/tools/plotline', emoji: '📖' },
    { name: 'Prompt Optimizer', path: '/tools/prompt-optimizer', emoji: '✨' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">VIBE</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                <span className="mr-1">{tool.emoji}</span>
                {tool.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">{tool.emoji}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}