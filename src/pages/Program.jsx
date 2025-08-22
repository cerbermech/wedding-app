import { useEffect, useState } from "react";
import "./../styles/program.css";

export default function Program() {
  // 📅 дата свадьбы — 8 августа 2026, 15:00
  const weddingDate = new Date(2026, 7, 8, 15, 0, 0);

  const [timeLeft, setTimeLeft] = useState("");

  const timeline = [
    { time: "15:00", icon: "💍", text: "ЗАГС — официальная церемония" },
    { time: "17:00", icon: "🍷", text: "Банкет — начало праздника" },
    { time: "Дальше больше", icon: "💃", text: "Программа будет уточняться" },
  ];

  // Обновляем таймер каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        setTimeLeft("Свадьба уже началась! 🎉");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  // 📅 Добавление в календарь
  const addToCalendar = () => {
    const title = encodeURIComponent("Свадьба Макса и Лены 💍");
    const details = encodeURIComponent("Наш праздник! 🎉");
    const location = encodeURIComponent("Екатеринбург");

    // ⚠️ Время в UTC! Если свадьба в 15:00 по Екатеринбургу (GMT+5),
    // то в UTC это будет 10:00.
    const start = "20260808T100000Z";
    const end = "20260808T160000Z";

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;

    window.open(googleUrl, "_blank");
  };

  return (
    <div className="program-container">
      <h2 className="program-title">📅 Программа дня</h2>

      {/* Таймер */}
      <div className="countdown">
        <p>До свадьбы осталось:</p>
        <h3>{timeLeft}</h3>
      </div>

      {/* Таймлайн */}
      <div className="timeline">
        {timeline.map((item, index) => {
          let statusClass = "";
          if (item.time.includes(":")) {
            const [h, m] = item.time.split(":").map(Number);
            const eventDate = new Date(weddingDate);
            eventDate.setHours(h, m);

            statusClass = eventDate < new Date() ? "past" : "future";
          }

          return (
            <div key={index} className={`timeline-item ${statusClass}`}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-icon">{item.icon}</div>
              <div className="timeline-text">{item.text}</div>
            </div>
          );
        })}
      </div>

      {/* Кнопка в календарь */}
      <button onClick={addToCalendar} className="calendar-btn">
        📅 Добавить в Google Calendar
      </button>
    </div>
  );
}