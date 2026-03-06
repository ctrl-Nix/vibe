// File location: src/app/page.tsx
// Home page

import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const tools = [
    {
      name: 'Judge',
      emoji: '⭐',
      description: 'Get AI feedback on your writing quality',
      path: '/tools/judge',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Oracle',
      emoji: '🔮',
      description: 'Brainstorm creative ideas for your stories',
      path: '/tools/oracle',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Plotline',
      emoji: '📖',
      description: 'Generate complete story structures',
      path: '/tools/plotline',
      color: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Prompt Optimizer',
      emoji: '✨',
      description: 'Improve your AI prompts',
      path: '/tools/prompt-optimizer',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 mb-6">
          Welcome to VIBE
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Your AI-powered creative writing assistant. Write better stories, brainstorm ideas, and optimize your prompts—all in one platform.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-12">Our Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path}>
              <div
                className={`bg-gradient-to-br ${tool.color} p-1 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer h-full`}
              >
                <div className="bg-slate-900 rounded-lg p-8">
                  <div className="text-5xl mb-4">{tool.emoji}</div>
                  <h3 className="text-2xl font-bold mb-3">{tool.name}</h3>
                  <p className="text-gray-300">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">Get Started</h2>
        <Link
          href="/tools/judge"
          className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          Start Creating Now →
        </Link>
      </section>
    </div>
  );
}


