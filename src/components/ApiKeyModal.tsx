'use client';

import React, { useState, useEffect } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { Provider } from '@/types';
import { validateKeyFormat } from '@/lib/validateKey';
import { testKey } from '@/lib/testKey';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey: savedKey, provider: savedProvider, isSaved, saveKey, removeKey, maskedKey } = useApiKey();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      if (isSaved && savedProvider) {
        setSelectedProvider(savedProvider);
        setStep(2);
      } else {
        setStep(1);
        setSelectedProvider(null);
      }
    }
  }, [isOpen, isSaved, savedProvider]);

  if (!isOpen) return null;

  const handleProviderSelect = (p: Provider) => {
    setSelectedProvider(p);
    setStep(2);
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedProvider) return;
    const keyToSave = keyInput.trim() || (savedProvider === selectedProvider ? savedKey : '');
    
    if (!keyToSave) {
      setError("Key cannot be empty.");
      return;
    }

    // 1. Validate Format
    const formatCheck = validateKeyFormat(keyToSave, selectedProvider);
    if (!formatCheck.valid) {
      setError(formatCheck.error || "Invalid format.");
      return;
    }

    // 2. Test Key
    setIsTesting(true);
    setError(null);
    const test = await testKey(keyToSave, selectedProvider);
    setIsTesting(false);

    if (!test.success) {
      setError(test.error || "Key verification failed.");
      return;
    }

    // 3. Save
    saveKey(keyToSave, selectedProvider);
    setSuccessMsg("✓ Key saved and verified!");
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
      setKeyInput('');
    }, 1500);
  };

  const providers: { id: Provider; name: string; subtitle: string; badge?: string }[] = [
    { id: 'gemini', name: 'Google Gemini', subtitle: 'Free tier ✓', badge: 'Recommended' },
    { id: 'openai', name: 'OpenAI', subtitle: 'Paid tier' },
    { id: 'anthropic', name: 'Anthropic', subtitle: 'Paid tier' },
  ];

  const getHint = () => {
    switch (selectedProvider) {
      case 'gemini': return "Should start with 'AIza...'";
      case 'openai': return "Should start with 'sk-...'";
      case 'anthropic': return "Should start with 'sk-ant-...'";
      default: return "";
    }
  };

  const getLink = () => {
    switch (selectedProvider) {
      case 'gemini': return { text: 'Get free key → aistudio.google.com/app/apikey', url: 'https://aistudio.google.com/app/apikey' };
      case 'openai': return { text: 'Get key → platform.openai.com/api-keys', url: 'https://platform.openai.com/api-keys' };
      case 'anthropic': return { text: 'Get key → console.anthropic.com', url: 'https://console.anthropic.com/' };
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="nb-card w-full max-w-lg p-10 animate-fade-in relative bg-[#FFFBF0]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-black hover:scale-110 transition-transform"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">API Settings</h2>

        {step === 1 ? (
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Step 1: Choose Provider</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`nb-card p-4 text-left flex flex-col justify-between h-36 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all bg-white`}
                >
                  <div>
                    {p.badge && (
                      <span className="nb-badge bg-black text-white text-[8px] px-1 py-0.5 mb-2 inline-block">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="font-black text-sm uppercase leading-tight">{p.name}</h3>
                  </div>
                  <p className="text-[10px] font-bold opacity-60 uppercase">{p.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
               <p className="text-sm font-bold uppercase tracking-widest opacity-60">Step 2: Enter Key</p>
               <button 
                onClick={() => setStep(1)}
                className="text-[10px] font-black uppercase underline tracking-widest hover:text-[#FF6B6B]"
               >
                 ← Change provider
               </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="nb-badge bg-[#FFE135] py-2 px-4 font-black">
                  {providers.find(p => p.id === selectedProvider)?.name}
                </div>
                {isSaved && savedProvider === selectedProvider && !keyInput && (
                   <div className="nb-badge bg-emerald-500/20 text-emerald-600 border-emerald-500/50">✓ Verified</div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    setError(null);
                  }}
                  placeholder={isSaved && savedProvider === selectedProvider ? "••••••••••••••••" : "Paste your key here"}
                  className="nb-input py-4 font-bold"
                />
                
                <div className="flex justify-between items-start px-1">
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{getHint()}</p>
                  {isSaved && savedProvider === selectedProvider && !keyInput && (
                    <p className="text-[10px] font-mono font-bold opacity-60">{maskedKey}</p>
                  )}
                </div>

                {getLink() && (
                   <a 
                    href={getLink()?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-[10px] font-black uppercase text-black/60 hover:text-black mt-4 underline decoration-black/20"
                   >
                     {getLink()?.text}
                   </a>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border-2 border-rose-500 text-rose-600 text-xs font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 text-xs font-black uppercase tracking-widest">
                {successMsg}
              </div>
            )}

            <div className="pt-2 space-y-4">
              <button 
                onClick={handleSave}
                disabled={isTesting || (!keyInput.trim() && savedProvider !== selectedProvider)}
                className="nb-button w-full py-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? "Testing key..." : "Save & Verify Key"}
              </button>
              
              {isSaved && (
                <button 
                  onClick={() => {
                    removeKey();
                    onClose();
                  }}
                  className="w-full text-[10px] font-black uppercase text-rose-500 hover:underline tracking-[0.2em]"
                >
                  Remove Key
                </button>
              )}
            </div>
          </div>
        )}

        <p className="mt-10 text-[10px] font-bold text-black/40 text-center uppercase tracking-widest">
          Your key lives only in your browser. VIBE never stores it.
        </p>
      </div>
    </div>
  );
};
