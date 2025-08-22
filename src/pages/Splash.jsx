import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/splash.css";
import PetalsBackground from "../components/PetalsBackground"; // 🌸 подключаем лепестки

export default function Splash() {
  const navigate = useNavigate();

  // дата свадьбы
  const weddingDate = new Date(2026, 7, 8, 15, 0, 0);

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="splash-container">
      <PetalsBackground />
      <div className="splash-card">
        <h1 className="splash-title">Максим ❤️ Лена</h1>
        <p className="splash-date">8 августа 2026</p>

        <div className="countdown">
          <span>{timeLeft.days}д</span> :
          <span>{timeLeft.hours}ч</span> :
          <span>{timeLeft.minutes}м</span> :
          <span>{timeLeft.seconds}с</span>
        </div>

        <button
          className="splash-btn"
          onClick={() => navigate("/menu")}
        >
          Перейти в приглашение
        </button>
      </div>
    </div>
  );
}