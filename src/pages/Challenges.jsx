import React, { useState, useEffect } from "react";
import "./../styles/challenges.css";

export default function Challenges() {
  const initialChallenges = [
    { id: 1, text: "📸 Сделай фото с тёщей", points: 10, done: false, proof: null },
    { id: 2, text: "🍷 Сними видео тоста", points: 15, done: false, proof: null },
    { id: 3, text: "🤳 Селфи с молодожёнами", points: 20, done: false, proof: null },
    { id: 4, text: "💃 Сними танец друзей", points: 15, done: false, proof: null },
  ];

  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem("challenges");
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [points, setPoints] = useState(() => {
    return Number(localStorage.getItem("points")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("challenges", JSON.stringify(challenges));
    localStorage.setItem("points", points);
  }, [challenges, points]);

  const handleProof = (id, file) => {
    const updated = challenges.map((ch) =>
      ch.id === id ? { ...ch, done: true, proof: URL.createObjectURL(file) } : ch
    );
    setChallenges(updated);
    const completed = challenges.find((ch) => ch.id === id);
    if (completed && !completed.done) {
      setPoints(points + completed.points);
    }
  };

  return (
    <div className="challenges-container">
      <h2>🎲 Свадебные челленджи</h2>
      <p>Выполняй задания → получай баллы → обменивай на призы!</p>

      <h3>🔥 Твои баллы: {points}</h3>

      <ul className="challenge-list">
        {challenges.map((ch) => (
          <li key={ch.id} className={ch.done ? "done" : ""}>
            <span>{ch.text} — {ch.points} очков</span>
            {!ch.done ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProof(ch.id, e.target.files[0])}
              />
            ) : (
              <span className="proof">
                ✅ Выполнено
                {ch.proof && <img src={ch.proof} alt="proof" />}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}