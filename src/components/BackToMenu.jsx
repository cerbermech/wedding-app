import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./backToMenu.css";

export default function BackToMenu() {
  return (
    <Link to="/menu" className="back-to-menu" aria-label="Вернуться в главное меню">
      <ArrowLeft size={18} strokeWidth={2} />
      <span>В меню</span>
    </Link>
  );
}
