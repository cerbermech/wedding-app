import { useEffect, useMemo, useState } from "react";
import {
  CakeSlice,
  CalendarDays,
  Camera,
  Car,
  Clock,
  Coffee,
  Gem,
  GlassWater,
  Music,
  PartyPopper,
  Smartphone,
  Sparkles,
  Utensils,
} from "lucide-react";
import "./../styles/program.css";

export default function Program() {
  const weddingDate = useMemo(() => new Date(2026, 7, 8, 8, 0, 0), []);
  const [timeLeft, setTimeLeft] = useState("");

  const timeline = [

    {
      time: "15:00-15:30",
      icon: Gem,
      text: "Официальная регистрация в ЗАГСе, Жемчужный зал, Отдел регистрации брака города Екатеринбурга",
    },
    { time: "15:35-16:30", icon: Car, text: "Дорога до площадки для гостей после ЗАГСа" },
    { time: "16:00", icon: GlassWater, text: "Можно приехать сразу на площадку: Серебряный Родник" },
    { time: "16:30-17:00", icon: GlassWater, text: "Фуршет и заселение гостей" },
    { time: "17:00", icon: Gem, text: "Выездная регистрация для всех гостей" },
    { time: "17:40", icon: PartyPopper, text: "Начало банкета" },
    { time: "19:00-19:10", icon: Utensils, text: "Горячие закуски" },
    { time: "20:00-20:10", icon: Utensils, text: "Горячее" },
    { time: "21:00", icon: CakeSlice, text: "Вынос торта" },
    { time: "21:30-22:00", icon: Clock, text: "Завершение программы" },
    { time: "22:00-23:00", icon: Music, text: "Танцы" },
    { time: "23:15", icon: PartyPopper, text: "Завершение банкета" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        setTimeLeft("Свадьба уже началась!");
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

  const addToGoogleCalendar = () => {
    const title = encodeURIComponent("Свадьба Макса и Лены");
    const details = encodeURIComponent("Свадебная программа в Серебряном Роднике");
    const location = encodeURIComponent("Екатеринбург, Серебряный Родник");
    const start = "20260808T030000Z";
    const end = "20260808T181500Z";
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
    window.open(googleUrl, "_blank");
  };

  const addToICS = () => {
    const title = "Свадьба Макса и Лены";
    const description = "Свадебная программа в Серебряном Роднике";
    const location = "Екатеринбург, Серебряный Родник";
    const start = "20260808T030000Z";
    const end = "20260808T181500Z";

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR
  `.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-invite.ics";
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="program-container">
      <h2 className="program-title">
        <CalendarDays size={28} strokeWidth={1.8} />
        <span>Программа дня</span>
      </h2>

      <div className="countdown">
        <p>До свадьбы осталось:</p>
        <h3>{timeLeft}</h3>
      </div>

      <section className="arrival-note" aria-label="Как приехать на мероприятие">
        <div className="arrival-note-title">
          <Sparkles size={20} strokeWidth={1.8} />
          <h3>Как приехать</h3>
        </div>
        <p>
          У гостей есть два удобных варианта: приехать на официальную регистрацию в ЗАГС к 15:00 или сразу на площадку
          к 16:00.
        </p>
        <p>
          Даже если вы поедете сразу в Серебряный Родник, вы ничего не пропустите: в 17:00 там пройдет выездная
          регистрация для всех гостей.
        </p>
      </section>

      <div className="timeline">
        {timeline.map((item, index) => {
          let statusClass = "";
          const startTime = item.time.match(/^\d{1,2}:\d{2}/)?.[0];

          if (startTime) {
            const [h, m] = startTime.split(":").map(Number);
            const eventDate = new Date(weddingDate);
            eventDate.setHours(h, m);
            statusClass = eventDate < new Date() ? "past" : "future";
          }

          const Icon = item.icon;
          return (
            <div key={`${item.time}-${item.text}`} className={`timeline-item ${statusClass}`}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-icon">
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div className="timeline-text">{item.text}</div>
            </div>
          );
        })}
      </div>

      <div className="calendar-buttons">
        <button onClick={addToGoogleCalendar} className="calendar-btn">
          <CalendarDays size={16} strokeWidth={1.9} />
          <span>Добавить в Google Calendar</span>
        </button>
        <button onClick={addToICS} className="calendar-btn">
          <Smartphone size={16} strokeWidth={1.9} />
          <span>Добавить в календарь телефона</span>
        </button>
      </div>
    </div>
  );
}
