// File location: src/app/page.tsx

'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { WorkflowMap } from '@/components/WorkflowMap';
import { Marquee } from '@/components/Marquee';
import { 
  OracleIcon, 
  PlotlineIcon, 
  JudgeIcon, 
  OptimizerIcon,
  KeyIcon,
  LockIcon,
  LinkIcon 
} from '@/components/Icons';
import { useEffect, useState } from 'react';

const HEADLINE_WORDS = [
  'Stop fighting your story.',
  'Start building it.',
];

const TYPEWRITER_TEXT = 'Start building it.';

export default function Home() {
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [doneTyping, setDoneTyping] = useState(false);

  // Typewriter effect on second line only
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < TYPEWRITER_TEXT.length) {
        setTyped(TYPEWRITER_TEXT.slice(0, i + 1));
        i++;
      } else {
        setDoneTyping(true);
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  // Blink cursor — stop after typing done + 2s
  useEffect(() => {
    if (!doneTyping) return;
    const timeout = setTimeout(() => setShowCursor(false), 2000);
    return () => clearTimeout(timeout);
  }, [doneTyping]);

  const tools = [
    {
      name: 'Oracle',
      label: 'V — Visualize',
      icon: <OracleIcon className="w-8 h-8" />,
      description:
        'Stuck on what happens next? Oracle gives you 3 distinct ideas — each with a twist you didn\'t see coming.',
      path: '/tools/oracle',
      color: 'bg-[#4ECDC4]',
    },
    {
      name: 'Plotline',
      label: 'I — Ideate',
      icon: <PlotlineIcon className="w-8 h-8" />,
      description:
        'Turn a rough concept into a full 3-act structure. Chapter beats, character arcs, the works.',
      path: '/tools/plotline',
      color: 'bg-[#FF6B6B]',
    },
    {
      name: 'Judge',
      label: 'B — Build',
      icon: <JudgeIcon className="w-8 h-8" />,
      description:
        'Paste your draft. Get a scorecard — strengths, specific fixes, and an honest verdict. No fluff.',
      path: '/tools/judge',
      color: 'bg-[#FFE135]',
    },
    {
      name: 'Prompt Optimizer',
      label: 'E — Express',
      icon: <OptimizerIcon className="w-8 h-8" />,
      description:
        'Bad prompts get generic output. Optimizer rewrites yours and teaches you exactly why it works better.',
      path: '/tools/prompt-optimizer',
      color: 'bg-white',
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#FFFBF0]">
      <Header />

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 pt-12 md:pt-24 pb-12 md:pb-20">
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] md:shadow-[12px_12px_0px_#000] p-6 md:p-20 relative overflow-hidden">

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE135] border-l-[4px] border-b-[4px] border-black" />

          <div className="relative z-10 max-w-3xl">

            {/* Acronym pill */}
            <div className="inline-block border-[2px] border-black bg-[#FFFBF0] px-4 py-1 text-xs font-black uppercase tracking-[0.25em] mb-8">
              V.I.B.E — Visualize · Ideate · Build · Express
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-8">
              <span className="block leading-[0.85] mb-2">
                Stop fighting<br />
                your story.
              </span>
              <span className="bg-[#FFE135] px-2 py-1 inline-block mt-2 md:mt-4">
                {typed}
                {showCursor && (
                  <span className="animate-pulse">|</span>
                )}
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl font-bold max-w-lg mb-4 leading-relaxed border-l-[6px] border-black pl-6 py-1">
              Your story. Structured.
            </p>

            {/* Sub-tagline */}
            <p className="text-base font-medium max-w-xl mb-12 opacity-60 leading-relaxed">
              vibe. is a creative writing workspace with 4 connected AI tools.
              Bring your own Gemini, OpenAI, or Anthropic key —
              your writing never leaves your browser.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-6 items-center">
              <Link
                href="/tools/oracle"
                className="nb-button text-lg px-10 py-4 bg-[#FFE135] font-black uppercase tracking-wide border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Start Writing →
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-black uppercase tracking-widest underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                How it works ↓
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter bg-black text-white px-6 py-2">
            How it works
          </h2>
          <div className="h-[4px] flex-grow bg-black" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-black">
          {[
            {
              step: '01',
              title: 'Add your key',
              desc: 'Paste your Gemini, OpenAI, or Anthropic key. It lives in your browser — we never see it.',
              bg: 'bg-[#FFFBF0]',
            },
            {
              step: '02',
              title: 'Set your Story Bible',
              desc: 'Tell VIBE your characters, setting, and tone once. Every tool uses it automatically.',
              bg: 'bg-[#FFE135]',
            },
            {
              step: '03',
              title: 'Run the workflow',
              desc: 'Brainstorm → Structure → Evaluate → Refine. One click sends output from tool to tool.',
              bg: 'bg-[#4ECDC4]',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.bg} p-6 md:p-10 border-b-[3px] md:border-b-0 md:border-r-[3px] last:border-b-0 md:last:border-r-0 border-black`}
            >
              <div className="text-4xl md:text-5xl font-black opacity-20 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-black uppercase mb-3">
                {item.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed opacity-70">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter bg-black text-white px-6 py-2">
            The toolkit
          </h2>
          <div className="h-[4px] flex-grow bg-black" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path} className="group">
              <div
                className={`h-full ${tool.color} border-[4px] border-black shadow-[6px_6px_0px_#000] md:shadow-[8px_8px_0px_#000] group-hover:shadow-[2px_2px_0px_#000] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all p-6 md:p-10`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="text-black">{tool.icon}</div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                      {tool.name}
                    </h3>
                  </div>
                  <div className="text-[10px] font-black tracking-[0.25em] uppercase opacity-40 text-right">
                    {tool.label}
                  </div>
                </div>
                <p className="text-sm font-bold leading-relaxed opacity-70 mb-8">
                  {tool.description}
                </p>
                <div className="inline-block bg-black text-white px-5 py-2 font-black uppercase text-xs tracking-widest group-hover:bg-white group-hover:text-black border-2 border-black transition-colors">
                  Open Tool →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Workflow Map */}
        <WorkflowMap />
      </section>

      {/* ── TRUST BAR ── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="border-[3px] border-black bg-white grid grid-cols-1 md:grid-cols-3 divide-y-[3px] md:divide-y-0 md:divide-x-[3px] divide-black">
          {[
            { icon: <KeyIcon className="w-6 h-6" />, title: 'Your key, your call', desc: 'Gemini free tier works. No credit card needed to start.' },
            { icon: <LockIcon className="w-6 h-6" />, title: 'Zero data stored', desc: 'Your writing and key live in your browser. Not our servers.' },
            { icon: <LinkIcon className="w-6 h-6" />, title: 'Tools that connect', desc: 'Output from one tool flows directly into the next.' },
          ].map((item, i) => (
            <div key={i} className="p-8 flex gap-4 items-start">
              <div className="mt-1 text-black">{item.icon}</div>
              <div>
                <div className="font-black uppercase text-sm mb-1">
                  {item.title}
                </div>
                <div className="text-sm opacity-60 font-medium leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="bg-black text-white p-8 md:p-16 text-center border-[4px] border-black shadow-[8px_8px_0px_#FFE135] md:shadow-[12px_12px_0px_#FFE135]">
          <div className="text-xs font-black tracking-[0.3em] uppercase opacity-40 mb-4">
            Free to use · Bring your own key
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Your story is waiting.<br />
            <span className="text-[#FFE135]">Stop stalling.</span>
          </h2>
          <p className="text-base font-medium opacity-50 mb-12 max-w-md mx-auto leading-relaxed">
            Add your free Gemini key and you're writing in under 2 minutes.
            No subscription. No account. No friction.
          </p>
          <Link
            href="/tools/oracle"
            className="inline-block bg-[#FFE135] text-black text-lg px-14 py-5 font-black uppercase tracking-wide border-[3px] border-white shadow-[4px_4px_0px_#FFE135] hover:shadow-[2px_2px_0px_#FFE135] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Start for free →
          </Link>
        </div>
      </section>
    </div>
  );
}