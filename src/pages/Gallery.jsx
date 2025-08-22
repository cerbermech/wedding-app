import { useState } from "react";
import "./../styles/gallery.css";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file), // локальный превью
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">📸 Фотоальбом</h2>

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
          {images.map((img) => (
            <div 
              key={img.id} 
              className="gallery-item"
              onClick={() => setSelectedImage(img.id)}
            >
              <img src={img.id} alt={img.name} />
            </div>
          ))}
        </div>
      )}

      {/* Лайтбокс */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Просмотр фото" className="lightbox-img" />
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
}