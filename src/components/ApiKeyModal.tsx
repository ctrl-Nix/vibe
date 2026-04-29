'use client';

import React, { useState, useEffect } from 'react';
import { useApiKey, ApiProvider } from '@/hooks/useApiKey';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey: savedKey, provider: savedProvider, isSaved, saveKey, removeKey, maskedKey } = useApiKey();
  const [keyInput, setKeyInput] = useState('');
  const [providerInput, setProviderInput] = useState<ApiProvider>('openai');

  useEffect(() => {
    if (isOpen && isSaved) {
      setProviderInput(savedProvider);
    }
  }, [isOpen, isSaved, savedProvider]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (keyInput.trim()) {
      saveKey(keyInput.trim(), providerInput);
      setKeyInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="nb-card w-full max-w-md p-8 animate-fade-in relative bg-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:scale-110 transition-transform"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Your API Key</h2>
        <p className="text-xs text-black/60 mb-8 font-medium">
          Your key is stored only in your browser. We never see it.
        </p>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">Select Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProviderInput('openai')}
                className={`nb-button text-xs py-2 px-0 ${providerInput === 'openai' ? 'bg-[#FFE135]' : 'bg-white'}`}
              >
                OpenAI
              </button>
              <button
                onClick={() => setProviderInput('anthropic')}
                className={`nb-button text-xs py-2 px-0 ${providerInput === 'anthropic' ? 'bg-[#FFE135]' : 'bg-white'}`}
              >
                Anthropic
              </button>
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">
              {providerInput === 'openai' ? 'OpenAI Key (sk-...)' : 'Anthropic Key (sk-ant-...)'}
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={isSaved ? "••••••••••••••••" : "Paste your key here"}
              className="nb-input"
            />
            {isSaved && !keyInput && (
              <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">
                Currently saved: <span className="font-mono">{maskedKey}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button 
              onClick={handleSave}
              disabled={!keyInput.trim()}
              className="nb-button w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Key
            </button>
            
            {isSaved && (
              <button 
                onClick={() => {
                  removeKey();
                  onClose();
                }}
                className="w-full text-[10px] font-bold uppercase text-rose-500 hover:underline tracking-widest"
              >
                Remove Key
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
