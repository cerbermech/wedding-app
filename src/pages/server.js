const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./guests.json";
const GALLERY_FILE = "./gallery.json";
const UPLOADS_DIR = "./uploads";
const WISHES_FILE = "./wishes.json";
const PLAYLIST_FILE = "./playlist.json";
const CHALLENGES_FILE = "./challenges.json";
const PROOFS_FILE = "./proofs.json";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// создаём папку uploads, если нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const requireAdmin = (req, res, next) => {
  if (!ADMIN_TOKEN) {
    return res.status(503).json({ error: "Удаление фото не настроено на сервере" });
  }

  const token = req.get("x-admin-token");
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "Нет доступа" });
  }

  next();
};

const getStoredFilename = (item = {}) => item.filename || path.basename(item.url || "");

// ====== ГОСТИ ======
const readGuests = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const saveGuests = (guests) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));
};

// 📌 Получить всех гостей
app.get("/api/guests", (req, res) => {
  res.json(readGuests());
});

// 📌 Добавить гостя
app.post("/api/guests", (req, res) => {
  const { name, choice, plusOne } = req.body;
  if (!name || !choice) return res.status(400).json({ error: "Нет данных" });

  const guests = readGuests();

  guests.push({
    name,
    choice,
    plusOne: plusOne || null, // если указал +1 — сохраняем
    date: new Date().toISOString(),
  });

  saveGuests(guests);

  // считаем реальное количество гостей
  const totalCount = guests.reduce((acc, g) => {
    if (g.choice === "🥂 Буду!") return acc + 1;
    if (g.choice === "👯 Буду с +1") return acc + (g.plusOne ? 2 : 1);
    return acc;
  }, 0);

  res.json({ success: true, count: totalCount });
});

// ====== ГАЛЕРЕЯ ======
// хранилище для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const readGallery = () => {
  if (!fs.existsSync(GALLERY_FILE)) return [];
  return JSON.parse(fs.readFileSync(GALLERY_FILE));
};

const saveGallery = (gallery) => {
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
};

// 📌 Получить все фото
app.get("/api/gallery", (req, res) => {
  res.json(readGallery());
});

// 📌 Загрузить фото
app.post("/api/gallery", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Файл не загружен" });

  const gallery = readGallery();
  const newPhoto = {
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    date: new Date().toISOString(),
  };

  gallery.push(newPhoto);
  saveGallery(gallery);

  res.json({ success: true, photo: newPhoto });
});

// 📌 Удалить фото. Доступно только владельцу по ADMIN_TOKEN.
app.delete("/api/gallery/:filename", requireAdmin, (req, res) => {
  const filename = path.basename(req.params.filename || "");

  if (!filename || filename !== req.params.filename) {
    return res.status(400).json({ error: "Некорректное имя файла" });
  }

  const gallery = readGallery();
  const photoIndex = gallery.findIndex((item) => getStoredFilename(item) === filename);

  if (photoIndex === -1) {
    return res.status(404).json({ error: "Фото не найдено" });
  }

  const [deletedPhoto] = gallery.splice(photoIndex, 1);
  saveGallery(gallery);

  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.json({ success: true, photo: deletedPhoto });
});

// 📌 раздаём загруженные фото
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== ПОЖЕЛАНИЯ ======
const readWishes = () => {
  if (!fs.existsSync(WISHES_FILE)) return [];
  return JSON.parse(fs.readFileSync(WISHES_FILE));
};

const saveWishes = (wishes) => {
  fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2));
};

// 📌 Получить все пожелания
app.get("/api/wishes", (req, res) => {
  res.json(readWishes());
});

// 📌 Добавить пожелание
app.post("/api/wishes", (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).json({ error: "Нет данных" });

  const wishes = readWishes();

  const newWish = {
    id: Date.now(),
    name,
    text,
    date: new Date().toISOString(),
  };

  wishes.unshift(newWish); // новые сверху
  saveWishes(wishes);

  res.json({ success: true, wish: newWish });
});


// ====== ПЛЕЙЛИСТ ======
const readPlaylist = () => {
  if (!fs.existsSync(PLAYLIST_FILE)) return [];
  return JSON.parse(fs.readFileSync(PLAYLIST_FILE));
};

const savePlaylist = (playlist) => {
  fs.writeFileSync(PLAYLIST_FILE, JSON.stringify(playlist, null, 2));
};

// 📌 Получить все песни
app.get("/api/playlist", (req, res) => {
  res.json(readPlaylist());
});

// 📌 Добавить песню
app.post("/api/playlist", (req, res) => {
  const { song, artist } = req.body;
  if (!song || !artist) return res.status(400).json({ error: "Нет данных" });

  const playlist = readPlaylist();

  const newSong = {
    id: Date.now(),
    song,
    artist,
    date: new Date().toISOString(),
  };

  playlist.push(newSong);
  savePlaylist(playlist);

  res.json({ success: true, song: newSong });
});

// ====== ЧЕЛЛЕНДЖИ ======
const readChallenges = () => {
  if (!fs.existsSync(CHALLENGES_FILE)) return [];
  return JSON.parse(fs.readFileSync(CHALLENGES_FILE));
};
app.get("/api/challenges", (req, res) => res.json(readChallenges()));

// ====== ДОКАЗАТЕЛЬСТВА ======
const readProofs = () => {
  if (!fs.existsSync(PROOFS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROOFS_FILE));
};
const saveProofs = (proofs) => {
  fs.writeFileSync(PROOFS_FILE, JSON.stringify(proofs, null, 2));
};

// 📌 Получить все доказательства
app.get("/api/proofs", (req, res) => {
  res.json(readProofs());
});

// 📌 Добавить доказательство
app.post("/api/proofs", upload.single("proof"), (req, res) => {
  const { challengeId, guest, caption } = req.body;
  if (!req.file || !challengeId || !guest) {
    return res.status(400).json({ error: "Не хватает данных" });
  }

  const proofs = readProofs();
  const newProof = {
    id: Date.now(),
    challengeId: Number(challengeId),
    guest,
    caption: caption || "",
    file: `/uploads/${req.file.filename}`,
    date: new Date().toISOString(),
  };

  proofs.push(newProof);
  saveProofs(proofs);

  res.json({ success: true, proof: newProof });
});

// ====== СТАРТ СЕРВЕРА ======
const PORT = 5003;
app.listen(PORT, () => console.log(`✅ Сервер запущен на http://localhost:${PORT}`));
