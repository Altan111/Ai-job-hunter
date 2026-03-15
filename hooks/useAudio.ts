import { useCallback, useEffect, useRef } from 'react';

type SoundMap = { [key: string]: HTMLAudioElement };

export const useAudio = (sounds: { [key: string]: string }): ((key: string) => void) => {
  const audioRefs = useRef<SoundMap>({});

  useEffect(() => {
    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    return () => {
        Object.values(audioRefs.current).forEach(audio => {
            audio.pause();
            audio.removeAttribute('src'); // Clean up
        });
    };
  }, [sounds]);

  const playSound = useCallback((key: string) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error(`Error playing sound "${key}":`, e));
    }
  }, []);

  return playSound;
};
