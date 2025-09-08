import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../MusicContext";
import "./../styles/splash.css";
import PetalsBackground from "../components/PetalsBackground";
import couplePhoto from "../assets/couple.jpg";

export default function Splash() {
  const navigate = useNavigate();
  const { startMusic } = useMusic(); // подключаем контекст

  const weddingDate = new Date(2026, 7, 8, 15, 0, 0);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

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

  const handleStartApp = () => {
    startMusic(); // включаем музыку глобально
    navigate("/menu");
  };

  return (
    <div
      className="splash-container"
      style={{ backgroundImage: `url(${couplePhoto})` }}
    >
      <PetalsBackground />
      <div className="splash-overlay">
        <div className="splash-top">
          <h1 className="splash-title">Максим ღ Лена</h1>
          <p className="splash-date">8 августа 2026</p>
          <div className="countdown">
            <span>{timeLeft.days}д</span> :
            <span>{timeLeft.hours}ч</span> :
            <span>{timeLeft.minutes}м</span> :
            <span>{timeLeft.seconds}с</span>
          </div>
        </div>

        <div className="splash-bottom">
          <button className="splash-btn" onClick={handleStartApp}>
            Перейти в приложение
          </button>
        </div>
      </div>
    </div>
  );
}