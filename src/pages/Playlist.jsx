import React, { useState } from "react";
import "./../styles/playlist.css";

export default function Playlist() {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!song.trim() || !artist.trim()) return;

    const newSong = { id: Date.now(), song, artist };
    setSongs([...songs, newSong]);

    // очистка формы
    setSong("");
    setArtist("");
  };

  return (
    <div className="playlist-container">
      <h2>🎶 Наш свадебный плейлист</h2>
      <p>Добавь свою любимую песню — мы включим её на празднике!</p>

      <form className="playlist-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название песни"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
        <input
          type="text"
          placeholder="Исполнитель"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <button type="submit">Добавить 🎵</button>
      </form>

      <ul className="playlist-list">
        {songs.map((s) => (
          <li key={s.id} className="playlist-item">
            <span>🎤 {s.artist} — 🎶 {s.song}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}