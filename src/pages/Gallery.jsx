import { useState, useEffect } from "react";
import { Images, Shield, Trash2, X } from "lucide-react";
import "./../styles/gallery.css";

const API_GALLERY = "/api/gallery";
const ADMIN_TOKEN_STORAGE_KEY = "weddingGalleryAdminToken";

const getPhotoFilename = (photo = {}) => photo.filename || photo.url?.split("/").pop() || "";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "");
  const [galleryMessage, setGalleryMessage] = useState("");

  useEffect(() => {
    fetch(API_GALLERY)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Ошибка загрузки фото:", err));
  }, []);

  const isAdminMode = Boolean(adminToken);

  const handleAdminMode = () => {
    if (isAdminMode) {
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      setAdminToken("");
      setGalleryMessage("Режим управления выключен.");
      return;
    }

    const token = window.prompt("Введите код управления фотоальбомом");
    if (!token?.trim()) return;

    const nextToken = token.trim();
    sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextToken);
    setAdminToken(nextToken);
    setGalleryMessage("Режим управления включен.");
  };

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

  const handleDelete = async (photo, e) => {
    e.stopPropagation();

    const filename = getPhotoFilename(photo);
    if (!filename) {
      setGalleryMessage("Не удалось определить файл для удаления.");
      return;
    }

    const confirmed = window.confirm("Удалить это фото из фотоальбома?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_GALLERY}/${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": adminToken,
        },
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Не удалось удалить фото");
      }

      setImages((prev) => prev.filter((item) => getPhotoFilename(item) !== filename));
      if (selectedImage === photo.url) setSelectedImage(null);
      setGalleryMessage("Фото удалено.");
    } catch (err) {
      setGalleryMessage(err.message);
      if (err.message === "Нет доступа") {
        sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        setAdminToken("");
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

      <div className="gallery-actions">
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
        <button type="button" className={`admin-toggle ${isAdminMode ? "active" : ""}`} onClick={handleAdminMode}>
          <Shield size={16} strokeWidth={1.9} />
          <span>{isAdminMode ? "Выйти из управления" : "Управление"}</span>
        </button>
      </div>

      {galleryMessage && <p className="gallery-status">{galleryMessage}</p>}

      {images.length === 0 ? (
        <p className="gallery-empty">Пока нет фото — будь первым!</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={getPhotoFilename(img) || i} className="gallery-item" onClick={() => setSelectedImage(img.url)}>
              <img src={img.url} alt={`Фото ${i + 1}`} />
              {isAdminMode && (
                <button type="button" className="delete-photo-btn" onClick={(e) => handleDelete(img, e)} aria-label="Удалить фото">
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              )}
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
