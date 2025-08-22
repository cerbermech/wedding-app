import "./../styles/program.css";

export default function Program() {
  const timeline = [
    { time: "13:00", icon: "💍", text: "ЗАГС — официальная церемония" },
    { time: "15:00", icon: "📸", text: "Фотосессия с молодожёнами" },
    { time: "17:00", icon: "🍷", text: "Банкет — начало праздника" },
    { time: "20:00", icon: "💃", text: "Первый танец" },
    { time: "22:00", icon: "🎂", text: "Торт и вечерние танцы" },
  ];

  return (
    <div className="program-container">
      <h2 className="program-title">📅 Программа дня</h2>
      <div className="timeline">
        {timeline.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-time">{item.time}</div>
            <div className="timeline-icon">{item.icon}</div>
            <div className="timeline-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}