import { useState, useEffect } from 'react';
import { StoryBible } from '@/types';

export const useBible = () => {
  const [bible, setBible] = useState<StoryBible>({
    title: '',
    genre: '',
    characters: '',
    setting: '',
    tone: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vibe_story_bible');
    if (saved) {
      try {
        setBible(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse Story Bible from localStorage', e);
      }
    }
  }, []);

  const saveBible = (newBible: StoryBible) => {
    setBible(newBible);
    localStorage.setItem('vibe_story_bible', JSON.stringify(newBible));
  };

  const getFormattedContext = (): string => {
    // If any field is empty, return empty string as per constraints
    if (
      !bible.title.trim() ||
      !bible.genre.trim() ||
      !bible.characters.trim() ||
      !bible.setting.trim() ||
      !bible.tone.trim()
    ) {
      return '';
    }

    return `Story: ${bible.title} (${bible.genre})\nCharacters: ${bible.characters}\nSetting: ${bible.setting}\nTone: ${bible.tone}`;
  };

  return {
    bible,
    setBible: saveBible,
    formattedContext: getFormattedContext(),
  };
};
