import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  CheckCircle2,
  Images,
  Mail,
  Gift,
  Music2,
  Flame,
} from "lucide-react";
import "./../styles/menu.css";
import PetalsBackground from "../components/PetalsBackground";

const menuItems = [
  { to: "/program", label: "Программа", icon: CalendarDays },
  { to: "/map", label: "Место", icon: MapPin },
  { to: "/rsvp", label: "Буду/Не буду", icon: CheckCircle2 },
  { to: "/gallery", label: "Фотоальбом", icon: Images },
  { to: "/wishes", label: "Пожелания", icon: Mail },
  { to: "/capsule", label: "Капсула", icon: Gift },
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
      </div>
    </div>
  );
}
