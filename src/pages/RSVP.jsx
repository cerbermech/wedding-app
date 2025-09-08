import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./../styles/rsvp.css";

export default function RSVP() {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  // Загружаем количество гостей при загрузке
  useEffect(() => {
    fetch("/api/guests")
      .then((res) => res.json())
      .then((data) => setGuestCount(data.length));
  }, []);

  const handleChoice = async (option) => {
    setChoice(option);

    if (option === "🥂 Буду!" || option === "👯 Буду с +1") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    // Отправляем на бэк
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, choice: option }),
    });

    const result = await res.json();
    if (result.success) {
      setGuestCount(result.count);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rsvp-container">
        <h2>✅ Спасибо, {name || "гость"}!</h2>
        <p>Ваш ответ сохранён.</p>
        <p className="guest-count">
          Уже подтвердили участие: {guestCount} гостей 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="rsvp-container">
      <h2 className="rsvp-title">✅ Подтверждение участия</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя"
        className="name-input"
        required
      />

      <div className="rsvp-options">
        <div
          className={`rsvp-card ${choice === "🥂 Буду!" ? "selected" : ""}`}
          onClick={() => handleChoice("🥂 Буду!")}
        >
          🥂 Буду!
        </div>
        <div
          className={`rsvp-card ${choice === "😢 Не смогу" ? "selected" : ""}`}
          onClick={() => handleChoice("😢 Не смогу")}
        >
          😢 Не смогу
        </div>
        <div
          className={`rsvp-card ${choice === "👯 Буду с +1" ? "selected" : ""}`}
          onClick={() => handleChoice("👯 Буду с +1")}
        >
          👯 Буду с +1
        </div>
      </div>

      <p className="guest-count">
        Уже подтвердили участие: {guestCount} гостей 🎉
      </p>
    </div>
  );
}