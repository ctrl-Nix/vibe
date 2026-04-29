'use client';

import React, { useState, useRef } from 'react';
import { useBible } from '@/hooks/useBible';

export const StoryBiblePanel: React.FC = () => {
  const { bible, setBible } = useBible();
  const [isOpen, setIsOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newBible = { ...bible, [name]: value };
    setBible(newBible);

    setShowSaved(true);
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setShowSaved(false), 1500);
  };

  const exportProject = () => {
    const projectData = {
      bible: localStorage.getItem('vibe_bible'),
      workflow: localStorage.getItem('vibe_workflow'),
      timestamp: Date.now(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe_project_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.bible) {
          localStorage.setItem('vibe_bible', data.bible);
          setBible(JSON.parse(data.bible));
          if (data.workflow) localStorage.setItem('vibe_workflow', data.workflow);
        }
      } catch (err) {
        console.error("Import failed", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={`fixed right-0 top-0 h-full bg-[#FFFBF0] border-l-[3px] border-black transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-0 top-24 -translate-x-full bg-[#FFE135] border-[3px] border-r-0 border-black p-3 shadow-[-4px_4px_0px_#000] active:shadow-none active:-translate-x-[calc(100%-4px)] transition-all"
        >
          <span className="text-xl">{isOpen ? '→' : '📖'}</span>
        </button>

        <div className={`p-8 h-full flex flex-col overflow-y-auto custom-scrollbar ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Story Bible</h2>
              <p className="text-[10px] font-bold text-black/40 mt-1 uppercase tracking-widest underline decoration-black/20">Persistent Context</p>
            </div>
            {showSaved && (
              <span className="nb-badge bg-[#4ECDC4] text-black">SAVED</span>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Story Title</label>
              <input
                name="title"
                value={bible.title}
                onChange={handleChange}
                placeholder="The Chronicles of..."
                className="nb-input py-3 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Genre</label>
                <input
                  name="genre"
                  value={bible.genre}
                  onChange={handleChange}
                  placeholder="Sci-Fi"
                  className="nb-input py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Tone</label>
                <input
                  name="tone"
                  value={bible.tone}
                  onChange={handleChange}
                  placeholder="Gritty"
                  className="nb-input py-3 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Characters</label>
              <textarea
                name="characters"
                value={bible.characters}
                onChange={handleChange}
                placeholder="Who are the main players?"
                rows={5}
                className="nb-input py-3 text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Setting</label>
              <textarea
                name="setting"
                value={bible.setting}
                onChange={handleChange}
                placeholder="Where/when does it happen?"
                rows={5}
                className="nb-input py-3 text-sm resize-none"
              />
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="h-[2px] bg-black/10 w-full mb-6" />
            <button 
              onClick={exportProject}
              className="w-full nb-button py-3 text-xs bg-black text-white hover:bg-white hover:text-black"
            >
              Export Project (.json)
            </button>
            <label className="w-full nb-button py-3 text-xs bg-white text-black cursor-pointer text-center block">
              Import Project
              <input 
                type="file" 
                accept=".json" 
                onChange={importProject} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="mt-auto pt-12 pb-6">
            <p className="text-[10px] font-bold text-black/30 text-center uppercase tracking-widest">
              Context flows to all tools automatically
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
