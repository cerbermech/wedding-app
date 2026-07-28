import { Link } from "react-router-dom";
import {
  Armchair,
  CalendarDays,
  Camera,
  CheckCircle2,
  Flame,
  Images,
  Mail,
  MapPin,
  Music2,
  Shirt,
  Trees,
  UsersRound,
} from "lucide-react";
import "./../styles/menu.css";
import PetalsBackground from "../components/PetalsBackground";

const menuItems = [
  { to: "/seating", label: "Рассадка", icon: Armchair },
  { to: "/program", label: "Программа", icon: CalendarDays },
  { to: "/second-day", label: "Второй день", icon: Trees },
  { to: "/map", label: "Место", icon: MapPin },
  { to: "/dresscode", label: "Дресс-код", icon: Shirt },
  { to: "/guests", label: "Для гостей", icon: UsersRound },
  { to: "/rsvp", label: "Буду/Не буду", icon: CheckCircle2 },
  { to: "/gallery", label: "Фотоальбом", icon: Images },
  { to: "/wishes", label: "Пожелания", icon: Mail },
  { to: "/playlist", label: "Плейлист гостей", icon: Music2 },
  { to: "/challenges", label: "Челленджи", icon: Flame },
];

export default function Menu() {
  return (
    <div className="menu-container">
      <PetalsBackground />

      <div className="menu-content">
        <h2 className="menu-title">Главное меню</h2>
        <div className="menu-grid">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <Link to={to} className="menu-item" key={to}>
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <Link to="/gallery" className="menu-photo-card" aria-label="Открыть фотоальбом">
          <Camera size={28} strokeWidth={1.7} />
          <div>
            <p>Фото после свадьбы</p>
            <span>После праздника здесь можно будет открыть и посмотреть общие фотографии.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
