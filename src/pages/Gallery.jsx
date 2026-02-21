import { useState, useEffect } from "react";
import { Images, X } from "lucide-react";
import "./../styles/gallery.css";

const API_GALLERY = "/api/gallery";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(API_GALLERY)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Ошибка загрузки фото:", err));
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const res = await fetch(API_GALLERY, {
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
      <h2 className="gallery-title">
        <Images size={28} strokeWidth={1.8} />
        <span>Фотоальбом</span>
      </h2>

      <p className="gallery-empty">
        Загружайте сюда всё, что связано с одним из нас. Потом вместе посмотрим и повеселимся.
      </p>

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
            <div key={i} className="gallery-item" onClick={() => setSelectedImage(img.url)}>
              <img src={img.url} alt={`Фото ${i + 1}`} />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Просмотр фото" className="lightbox-img" />
          <button className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Закрыть">
            <X size={20} strokeWidth={2.1} />
          </button>
        </div>
      )}
    </div>
  );
}
