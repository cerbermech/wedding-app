import { Link } from "react-router-dom";
import "./../styles/menu.css";
import PetalsBackground from "../components/PetalsBackground";

export default function Menu() {
  return (
    <div className="menu-container">
      {/* 🌸 фоновые лепестки */}
      <PetalsBackground />

      <div className="menu-content">
        <h2 className="menu-title">Главное меню</h2>
        <div className="menu-grid">
          <Link to="/program" className="menu-item">📅 Программа</Link>
          <Link to="/map" className="menu-item">📍 Место</Link>
          <Link to="/rsvp" className="menu-item">✅ RSVP</Link>
          <Link to="/gallery" className="menu-item">📸 Фотоальбом</Link>
          <Link to="/wishes" className="menu-item">💌 Пожелания</Link>
          <Link to="/capsule" className="menu-item">🎁 Капсула</Link>
          <Link to="/playlist" className="menu-item">🎶 Плейлист гостей</Link>
          <Link to="/challenges" className="menu-item">🔥 Челленджи</Link>
        </div>
      </div>
    </div>
  );
}