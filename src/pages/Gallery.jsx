import { useState, useEffect } from "react";
import "./../styles/gallery.css";

const API_URL = "http://46.173.28.77:5000";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Загружаем фото из бэка при монтировании
  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Ошибка загрузки фото:", err));
  }, []);

  // Загрузка новых фото
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const res = await fetch(`${API_URL}/api/gallery`, {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (result.success) {
          setImages((prev) => [...prev, result.photo]);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    }
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">📸 Фотоальбом</h2>
      <p className="gallery-empty">Загружайте сюда все, что связанно с одним из нас. Потом вместе посмотрим и повеселимся)</p>
      <label className="upload-label">
        Загрузить фото
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>

      {images.length === 0 ? (
        <p className="gallery-empty">Пока нет фото — будь первым!</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery-item"
              onClick={() => setSelectedImage(`${API_URL}${img.url}`)}
            >
              <img src={`${API_URL}${img.url}`} alt={`Фото ${i + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Лайтбокс */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Просмотр фото" className="lightbox-img" />
          <button
            className="lightbox-close"
            onClick={() => setSelectedImage(null)}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
}