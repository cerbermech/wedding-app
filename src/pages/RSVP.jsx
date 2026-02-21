import { useState, useEffect } from "react";
import { CheckCircle2, ListChecks, UserCheck, UserMinus, Users } from "lucide-react";
import confetti from "canvas-confetti";
import "./../styles/rsvp.css";

const API_GUESTS = "/api/guests";
const CHOICE_YES = "🥂 Буду!";
const CHOICE_NO = "😢 Не смогу";
const CHOICE_PLUS_ONE = "👯 Буду с +1";

const stripEmojiPrefix = (value = "") =>
  value.replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\s]+/gu, "");

export default function RSVP() {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(null);
  const [plusOne, setPlusOne] = useState("");
  const [guests, setGuests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

    if (choice === CHOICE_YES || choice === CHOICE_PLUS_ONE) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    try {
      const res = await fetch(API_GUESTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          choice,
          plusOne: choice === CHOICE_PLUS_ONE ? plusOne || null : null,
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
    if (g.choice === CHOICE_YES) return acc + 1;
    if (g.choice === CHOICE_PLUS_ONE) return acc + (g.plusOne ? 2 : 1);
    return acc;
  }, 0);

  return (
    <div className="rsvp-container">
      <h2 className="rsvp-title">
        <CheckCircle2 size={28} strokeWidth={1.8} />
        <span>Подтверждение участия</span>
      </h2>

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

          {choice === CHOICE_PLUS_ONE && (
            <input
              type="text"
              value={plusOne}
              onChange={(e) => setPlusOne(e.target.value)}
              placeholder="Имя спутника"
              className="name-input"
            />
          )}

          <div className="rsvp-options">
            <div className={`rsvp-card ${choice === CHOICE_YES ? "selected" : ""}`} onClick={() => setChoice(CHOICE_YES)}>
              <UserCheck size={18} strokeWidth={1.9} />
              <span>{stripEmojiPrefix(CHOICE_YES)}</span>
            </div>

            <div className={`rsvp-card ${choice === CHOICE_NO ? "selected" : ""}`} onClick={() => setChoice(CHOICE_NO)}>
              <UserMinus size={18} strokeWidth={1.9} />
              <span>{stripEmojiPrefix(CHOICE_NO)}</span>
            </div>

            <div
              className={`rsvp-card ${choice === CHOICE_PLUS_ONE ? "selected" : ""}`}
              onClick={() => setChoice(CHOICE_PLUS_ONE)}
            >
              <Users size={18} strokeWidth={1.9} />
              <span>{stripEmojiPrefix(CHOICE_PLUS_ONE)}</span>
            </div>
          </div>

          {choice && (
            <button className="submit-btn" onClick={handleSubmit} disabled={!name.trim()}>
              Отправить
            </button>
          )}
        </>
      )}

      <div className="guest-list">
        <h3>
          <ListChecks size={20} strokeWidth={1.9} />
          <span>Уже подтвердили участие</span>
        </h3>
        <p className="guest-count">Всего гостей: {totalCount}</p>

        {guests.length === 0 ? (
          <p>Пока никого</p>
        ) : (
          <ul>
            {guests.map((g, i) => (
              <li key={i}>
                <strong>{g.name}</strong> — {stripEmojiPrefix(g.choice)}
                {g.plusOne && <span> (с {g.plusOne})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
