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
      }).catch(() => {});
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
          bottom: "20px",
          right: "20px",
          background: "rgba(0, 0, 0, 0)",
          color: "blacke",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);