import { createContext, useContext, useRef, useState } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.1;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => { });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <MusicContext.Provider value={{ startMusic, toggleMusic, isPlaying }}>
      {children}
      <audio ref={audioRef} autoPlay loop muted>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Глобальная кнопка-плеер */}
      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          background: "rgba(255,255,255,0.25)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          fontSize: "18px",
          cursor: "pointer",
          zIndex: 9999,
          backdropFilter: "blur(4px)",
          padding: "1px",
        }}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);