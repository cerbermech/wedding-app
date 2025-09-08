import { Link } from "react-router-dom";
import "./../styles/menu.css";
import PetalsBackground from "../components/PetalsBackground";
import {
  Calendar, MapPin, CheckCircle, Image, Heart, Gift, Music, Flame
} from "lucide-react"; // иконки

export default function Menu() {
  return (
    <div className="menu-container">
      <PetalsBackground />

      <div className="menu-content">
        <h2 className="menu-title">Главное меню</h2>
        <div className="menu-grid">
          <Link to="/program" className="menu-item">
            <Calendar className="menu-icon" /> Программа
          </Link>
          <Link to="/map" className="menu-item">
            <MapPin className="menu-icon" /> Место
          </Link>
          <Link to="/rsvp" className="menu-item">
            <CheckCircle className="menu-icon" /> Буду/Не буду
          </Link>
          <Link to="/gallery" className="menu-item">
            <Image className="menu-icon" /> Фотоальбом
          </Link>
          <Link to="/wishes" className="menu-item">
            <Heart className="menu-icon" /> Пожелания
          </Link>
          <Link to="/capsule" className="menu-item">
            <Gift className="menu-icon" /> Капсула
          </Link>
          <Link to="/playlist" className="menu-item">
            <Music className="menu-icon" /> Плейлист
          </Link>
          <Link to="/challenges" className="menu-item">
            <Flame className="menu-icon" /> Челленджи
          </Link>
        </div>
      </div>
    </div>
  );
}