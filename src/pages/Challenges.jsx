import React, { useState, useEffect } from "react";
import "./../styles/challenges.css";

const API_CHALLENGES = "http://46.173.28.77:5000/api/challenges";
const API_PROOFS = "http://46.173.28.77:5000/api/proofs";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [modalContent, setModalContent] = useState(null);

  // 📌 Подтянуть список
  useEffect(() => {
    fetch(API_CHALLENGES)
      .then((res) => res.json())
      .then(setChallenges)
      .catch((err) => console.error("Ошибка загрузки челленджей:", err));

    fetch(API_PROOFS)
      .then((res) => res.json())
      .then(setProofs)
      .catch((err) => console.error("Ошибка загрузки доказательств:", err));
  }, []);

  // 📌 Отправить доказательство
  const handleProof = async (challengeId, file) => {
    if (!guestName.trim()) {
      alert("⚠ Сначала введите своё имя!");
      return;
    }

    const caption = prompt("Добавь подпись к фото/видео:");
    const formData = new FormData();
    formData.append("proof", file);
    formData.append("challengeId", challengeId);
    formData.append("guest", guestName);
    formData.append("caption", caption || "");

    try {
      const res = await fetch(API_PROOFS, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProofs((prev) => [...prev, data.proof]);
      }
    } catch (err) {
      console.error("Ошибка загрузки доказательства:", err);
    }
  };

  // 📌 Открыть модалку
  const openModal = (file) => {
    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
      setModalContent(
        <img src={`http://46.173.28.77:5000${file}`} alt="proof" />
      );
    } else {
      setModalContent(
        <video src={`http://46.173.28.77:5000${file}`} controls autoPlay />
      );
    }
  };

  return (
    <div className="challenges-container">
      <h2>Свадебные челленджи</h2>
      <p>Выполняй задания → получай баллы → обменивай на призы!</p>

      <div className="guest-input">
        <input
          type="text"
          placeholder="Ваше имя"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>

      <ul className="challenge-list">
        {challenges.map((ch) => (
          <li key={ch.id}>
            <span>
              {ch.text} — {ch.points} очков
            </span>

            <input
              id={`upload-${ch.id}`}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleProof(ch.id, e.target.files[0])}
              disabled={!guestName.trim()} // нельзя загрузить без имени
            />
            <label
              htmlFor={`upload-${ch.id}`}
              className={`upload-label ${!guestName.trim() ? "disabled" : ""}`}
              onClick={(e) => {
                if (!guestName.trim()) {
                  e.preventDefault();
                  alert("⚠ Сначала введите своё имя!");
                }
              }}
            >
              Загрузить фото/видео
            </label>

            <div className="proofs">
              {proofs
                .filter((p) => p.challengeId === ch.id)
                .map((p) => (
                  <div key={p.id} className="proof">
                    <p>👤 {p.guest}</p>
                    {p.caption && <p>{p.caption}</p>}

                    {p.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={`http://46.173.28.77:5000${p.file}`}
                        alt="proof"
                        onClick={() => openModal(p.file)}
                      />
                    ) : (
                      <video
                        src={`http://46.173.28.77:5000${p.file}`}
                        style={{
                          maxWidth: "200px",
                          borderRadius: "12px",
                          marginTop: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => openModal(p.file)}
                      />
                    )}
                  </div>
                ))}
            </div>
          </li>
        ))}
      </ul>

      {/* 🔹 модалка */}
      {modalContent && (
        <div className="modal" onClick={() => setModalContent(null)}>
          <div className="modal-content">{modalContent}</div>
        </div>
      )}
    </div>
  );
}