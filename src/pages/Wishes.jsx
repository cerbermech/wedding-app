import { useState, useEffect } from "react";
import "./../styles/wishes.css";

export default function Wishes() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideshow, setSlideshow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;

    const newWish = { id: Date.now(), name, text: wish };
    setWishes([newWish, ...wishes]);
    setName("");
    setWish("");
  };

  // Слайдшоу переключение
  useEffect(() => {
    if (slideshow && wishes.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % wishes.length);
      }, 4000); // каждые 4 секунды
      return () => clearInterval(interval);
    }
  }, [slideshow, wishes]);

  return (
    <div className="wishes-container">
      <h2 className="wishes-title">💌 Пожелания</h2>

      {!slideshow ? (
        <>
          <form className="wishes-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <textarea
              placeholder="Напишите пожелание..."
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              required
            />

            <button type="submit" className="wishes-button">Отправить</button>
          </form>

          <button 
            className="slideshow-button"
            onClick={() => setSlideshow(true)}
            disabled={wishes.length === 0}
          >
            ▶ Запустить слайдшоу
          </button>

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
        </>
      ) : (
        <div className="slideshow-container">
          <div className="slideshow-card">
            <h3>{wishes[currentIndex].name} говорит:</h3>
            <p>{wishes[currentIndex].text}</p>
          </div>
          <button 
            className="slideshow-exit"
            onClick={() => setSlideshow(false)}
          >
            ✖ Выйти
          </button>
        </div>
      )}
    </div>
  );
}