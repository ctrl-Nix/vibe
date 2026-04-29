// File location: src/app/page.tsx
// Home page (Neobrutalism Redesign)

import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const tools = [
    {
      name: 'Judge',
      emoji: '⭐',
      description: 'Get AI feedback on your writing quality. Professional critique for drafts.',
      path: '/tools/judge',
      color: 'bg-[#FFE135]',
    },
    {
      name: 'Oracle',
      emoji: '🔮',
      description: 'Brainstorm creative ideas for your stories. Infinite narrative possibilities.',
      path: '/tools/oracle',
      color: 'bg-[#4ECDC4]',
    },
    {
      name: 'Plotline',
      emoji: '📖',
      description: 'Generate complete story structures. Architect your narrative skeleton.',
      path: '/tools/plotline',
      color: 'bg-[#FF6B6B]',
    },
    {
      name: 'Prompt Optimizer',
      emoji: '✨',
      description: 'Improve your AI prompts. Precision engineering for creative minds.',
      path: '/tools/prompt-optimizer',
      color: 'bg-white',
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#FFFBF0]">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_#000] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE135] border-l-[4px] border-b-[4px] border-black -mr-16 -mt-16 rotate-45"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-8">
              Write <span className="bg-[#FFE135] px-4">Better</span> <br /> 
              Stories <span className="text-[#FF6B6B]">Faster</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold max-w-xl mb-12 leading-relaxed border-l-[8px] border-black pl-8 py-2">
              VIBE is a Neobrutalist creative workspace where AI meets raw imagination. Bring your own key, control your context, and build worlds.
            </p>
            <div className="flex flex-wrap gap-6">
               <Link href="/tools/judge" className="nb-button text-xl px-12 py-5 bg-[#FFE135]">
                 Start Creating →
               </Link>
               <div className="nb-badge bg-white py-5 px-8 font-black flex items-center gap-3">
                 <span className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></span>
                 SYSTEMS ONLINE
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-6 py-2">The Toolkit</h2>
          <div className="h-[4px] flex-grow bg-black"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path} className="group">
              <div className={`h-full ${tool.color} border-[4px] border-black shadow-[8px_8px_0px_#000] group-hover:shadow-[4px_4px_0px_#000] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all p-10`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-20 h-20 bg-white border-[4px] border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_#000]">
                    {tool.emoji}
                  </div>
                  <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Tool v1.0</div>
                </div>
                <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">{tool.name}</h3>
                <p className="text-lg font-bold leading-tight opacity-70 mb-8">{tool.description}</p>
                <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-xs tracking-widest group-hover:bg-white group-hover:text-black border-2 border-black transition-colors">
                  Open Tool →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-black text-white p-16 text-center border-[4px] border-black shadow-[12px_12px_0px_#FFE135]">
           <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Ready to Unleash the VIBE?</h2>
           <p className="text-xl font-bold opacity-60 mb-12 max-w-xl mx-auto">
             No subscriptions. No tracking. Just raw creative power powered by your own API keys.
           </p>
           <Link href="/tools/oracle" className="nb-button bg-[#FFE135] text-black text-xl px-16 py-6 inline-block">
             Begin Brainstorming
           </Link>
        </div>
      </section>
    </div>
  );
}
