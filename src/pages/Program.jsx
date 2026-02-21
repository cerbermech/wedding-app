import { useEffect, useState } from "react";
import { CalendarDays, Gem, GlassWater, PartyPopper, Smartphone } from "lucide-react";
import "./../styles/program.css";

export default function Program() {
  const weddingDate = new Date(2026, 7, 8, 15, 0, 0);
  const [timeLeft, setTimeLeft] = useState("");

  const timeline = [
    { time: "15:00", icon: Gem, text: "ЗАГС — официальная церемония" },
    { time: "17:00", icon: GlassWater, text: "Банкет — начало праздника" },
    { time: "Дальше больше", icon: PartyPopper, text: "Еще много времени, программа будет уточняться" },
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
    const details = encodeURIComponent("Наш праздник!");
    const location = encodeURIComponent("Екатеринбург");
    const start = "20260808T100000Z";
    const end = "20260808T160000Z";
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
    window.open(googleUrl, "_blank");
  };

  const addToICS = () => {
    const title = "Свадьба Макса и Лены";
    const description = "Наш праздник!";
    const location = "Екатеринбург";
    const start = "20260808T100000Z";
    const end = "20260808T160000Z";

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

      <div className="timeline">
        {timeline.map((item, index) => {
          let statusClass = "";
          if (item.time.includes(":")) {
            const [h, m] = item.time.split(":").map(Number);
            const eventDate = new Date(weddingDate);
            eventDate.setHours(h, m);
            statusClass = eventDate < new Date() ? "past" : "future";
          }

          const Icon = item.icon;
          return (
            <div key={index} className={`timeline-item ${statusClass}`}>
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
          <span>Добавить в Календарь телефона</span>
        </button>
      </div>
    </div>
  );
}
