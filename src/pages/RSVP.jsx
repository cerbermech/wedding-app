import { useState } from "react";
import "./../styles/rsvp.css";

// Для конфетти
import confetti from "canvas-confetti";

export default function RSVP() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("иду");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ name, guests, comment });

    if (guests === "иду" || guests === "иду с +1") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rsvp-container">
        <h2>✅ Спасибо, {name}!</h2>
        <p>Ваш ответ сохранён.</p>
      </div>
    );
  }

  return (
    <div className="rsvp-container">
      <h2 className="rsvp-title">✅ RSVP — Подтверждение участия</h2>
      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label>
          Ваше имя:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Введите имя"
          />
        </label>

        <label>
          Ваш ответ:
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option value="иду">🥂 Иду</option>
            <option value="не смогу">😢 Не смогу</option>
            <option value="иду с +1">👯 Иду с +1</option>
          </select>
        </label>

        <label>
          Комментарий:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: нужен вегетарианский стол"
          />
        </label>

        <button type="submit" className="rsvp-button">Отправить</button>
      </form>
    </div>
  );
}