import { useState, useEffect } from 'react';

export type ApiProvider = 'openai' | 'anthropic';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [provider, setProvider] = useState<ApiProvider>('openai');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('vibe_api_key');
    const savedProvider = localStorage.getItem('vibe_api_provider') as ApiProvider;
    
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
    if (savedProvider) {
      setProvider(savedProvider);
    }
  }, []);

  const saveKey = (key: string, newProvider: ApiProvider) => {
    localStorage.setItem('vibe_api_key', key);
    localStorage.setItem('vibe_api_provider', newProvider);
    setApiKey(key);
    setProvider(newProvider);
    setIsSaved(true);
  };

  const removeKey = () => {
    localStorage.removeItem('vibe_api_key');
    localStorage.removeItem('vibe_api_provider');
    setApiKey('');
    setProvider('openai');
    setIsSaved(false);
  };

  const getMaskedKey = () => {
    if (!apiKey) return '';
    if (apiKey.length < 8) return '****';
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
  };

  return {
    apiKey,
    provider,
    isSaved,
    saveKey,
    removeKey,
    maskedKey: getMaskedKey(),
  };
};
