"use client";
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

interface MusicCtx { playing: boolean; toggle: () => void; }
const MusicContext = createContext<MusicCtx>({ playing: false, toggle: () => {} });
export const useMusic = () => useContext(MusicContext);

export default function MusicToggle({ children }: { children?: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || startedRef.current) return;
    startedRef.current = true;
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => { startedRef.current = false; });
  }, []);

  useEffect(() => {
    const audio = new Audio("/music/Background Music.mp3");
    audio.loop   = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Try immediate autoplay
    audio.play()
      .then(() => { startedRef.current = true; setPlaying(true); })
      .catch(() => {
        // Blocked — attach one-time listeners, but defer so any
        // simultaneous button click runs its own handler first
        const unlock = () => {
          setTimeout(() => {
            if (!startedRef.current) startAudio();
          }, 50);
        };
        window.addEventListener("click",      unlock, { passive: true, once: true });
        window.addEventListener("touchstart", unlock, { passive: true, once: true });
        window.addEventListener("scroll",     unlock, { passive: true, once: true });
        window.addEventListener("keydown",    unlock, { passive: true, once: true });
      });

    return () => { audio.pause(); };
  }, [startAudio]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      startedRef.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  return (
    <MusicContext.Provider value={{ playing, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}
