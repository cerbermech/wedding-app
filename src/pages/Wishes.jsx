import { useState, useEffect } from "react";
import "./../styles/wishes.css";

const API_WISHES = "/api/wishes";

export default function Wishes() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState([]);

  // 📌 Подтянуть список пожеланий
  useEffect(() => {
    fetch(API_WISHES)
      .then((res) => res.json())
      .then((data) => setWishes(data))
      .catch((err) => console.error("Ошибка загрузки пожеланий:", err));
  }, []);

  // 📌 Отправить новое пожелание
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;

    try {
      const res = await fetch(API_WISHES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text: wish }),
      });

      const data = await res.json();
      if (data.success) {
        setWishes((prev) => [data.wish, ...prev]);
        setName("");
        setWish("");
      }
    } catch (err) {
      console.error("Ошибка сохранения пожелания:", err);
    }
  };

  return (
    <div className="wishes-container">
      <h2 className="wishes-title">💌 Пожелания</h2>

      <form className="wishes-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Напишите поздравление..."
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          required
        />

        <button type="submit" className="wishes-button">
          Отправить
        </button>
      </form>

      <div className="wishes-list">
        {wishes.length === 0 ? (
          <p className="wishes-empty">Пока нет пожеланий — будь первым!</p>
        ) : (
          wishes.map((item) => (
            <div key={item.id} className="wish-item">
              <strong>{item.name}:</strong>
              <p>{item.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}