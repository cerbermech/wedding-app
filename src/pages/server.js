const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./guests.json";

// Читаем гостей
const readGuests = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Сохраняем гостей
const saveGuests = (guests) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));
};

// 📌 Получить всех гостей
app.get("/api/guests", (req, res) => {
  res.json(readGuests());
});

// 📌 Добавить гостя
app.post("/api/guests", (req, res) => {
  const { name, choice } = req.body;
  if (!name || !choice) return res.status(400).json({ error: "Нет данных" });

  const guests = readGuests();
  guests.push({ name, choice, date: new Date().toISOString() });
  saveGuests(guests);

  res.json({ success: true, count: guests.length });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на http://localhost:${PORT}`));