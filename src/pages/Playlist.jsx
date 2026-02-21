import { useState, useEffect } from "react";
import "./../styles/playlist.css";

const API_PLAYLIST = "/api/playlist";

export default function Playlist() {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");

  // 📌 Подтянуть плейлист
  useEffect(() => {
    fetch(API_PLAYLIST)
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Ошибка загрузки плейлиста:", err));
  }, []);

  // 📌 Добавить песню
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!song.trim() || !artist.trim()) return;

    try {
      const res = await fetch(API_PLAYLIST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, artist }),
      });

      const data = await res.json();
      if (data.success) {
        setSongs((prev) => [...prev, data.song]);
        setSong("");
        setArtist("");
      }
    } catch (err) {
      console.error("Ошибка сохранения песни:", err);
    }
  };

  return (
    <div className="playlist-container">
      <h2 className="playlist-title">🎶 Наш свадебный плейлист</h2>
      <p className="playlist-subtitle">
        Добавь свою любимую песню — мы включим её на празднике!
      </p>

      <form className="playlist-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название песни"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Исполнитель"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <button type="submit">Добавить</button>
      </form>

      <ul className="playlist-list">
        {songs.length === 0 ? (
          <p className="playlist-empty">
            Пока никто не добавил песню — начни первым!
          </p>
        ) : (
          songs.map((s) => (
            <li key={s.id} className="playlist-item">
              <span>🎤 {s.artist} — {s.song}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}