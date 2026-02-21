import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./../styles/rsvp.css";

const API_GUESTS = "/api/guests";

export default function RSVP() {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(null);
  const [plusOne, setPlusOne] = useState("");
  const [guests, setGuests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Загрузка гостей
  const loadGuests = () => {
    fetch(API_GUESTS)
      .then((res) => res.json())
      .then((data) => setGuests(data))
      .catch((err) => console.error("Ошибка загрузки гостей:", err));
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !choice) return;

    if (choice === "🥂 Буду!" || choice === "👯 Буду с +1") {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    try {
      const res = await fetch(API_GUESTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          choice,
          plusOne: choice === "👯 Буду с +1" ? plusOne || null : null,
        }),
      });

      const result = await res.json();
      if (result.success) {
        loadGuests();
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Ошибка отправки RSVP:", err);
    }
  };

  const totalCount = guests.reduce((acc, g) => {
    if (g.choice === "🥂 Буду!") return acc + 1;
    if (g.choice === "👯 Буду с +1") return acc + (g.plusOne ? 2 : 1);
    return acc;
  }, 0);

  return (
    <div className="rsvp-container">
      <h2 className="rsvp-title">✅ Подтверждение участия</h2>

      {!submitted && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="name-input"
            required
          />

          {choice === "👯 Буду с +1" && (
            <input
              type="text"
              value={plusOne}
              onChange={(e) => setPlusOne(e.target.value)}
              placeholder="Имя спутника"
              className="name-input"
            />
          )}

          <div className="rsvp-options">
            <div
              className={`rsvp-card ${choice === "🥂 Буду!" ? "selected" : ""}`}
              onClick={() => setChoice("🥂 Буду!")}
            >
              🥂 Буду!
            </div>

            <div
              className={`rsvp-card ${choice === "😢 Не смогу" ? "selected" : ""}`}
              onClick={() => setChoice("😢 Не смогу")}
            >
              😢 Не смогу
            </div>

            <div
              className={`rsvp-card ${choice === "👯 Буду с +1" ? "selected" : ""}`}
              onClick={() => setChoice("👯 Буду с +1")}
            >
              👯 Буду с +1
            </div>
          </div>

          {choice && (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              Отправить
            </button>
          )}
        </>
      )}

      <div className="guest-list">
        <h3>📋 Уже подтвердили участие</h3>
        <p className="guest-count">Всего гостей: {totalCount} 🎉</p>

        {guests.length === 0 ? (
          <p>Пока никого</p>
        ) : (
          <ul>
            {guests.map((g, i) => (
              <li key={i}>
                <strong>{g.name}</strong> — {g.choice}
                {g.plusOne && <span> (с {g.plusOne})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}