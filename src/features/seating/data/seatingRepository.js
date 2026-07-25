import { createEmptySeating, SCHEMA_VERSION } from "./seatingDefaults";

const API_URL = "/api/seating";
const DRAFT_KEY = "wedding.seating.draft.v2";
const PUBLISHED_KEY = "wedding.seating.published.v2";
const clone = (value) => structuredClone(value);

function normalize(value) {
  if (!value || value.schemaVersion !== SCHEMA_VERSION || !Array.isArray(value.guests) || !Array.isArray(value.tables) || !Array.isArray(value.groups)) return null;
  return value;
}

function readLocal(key) {
  try {
    return normalize(JSON.parse(localStorage.getItem(key)));
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Ошибка сервера: ${response.status}`);
  }
  return response.json();
}

export const seatingRepository = {
  getLocalDraft: () => clone(readLocal(DRAFT_KEY) || createEmptySeating()),

  async getDraft() {
    try {
      const value = normalize(await request("/draft"));
      if (value) {
        writeLocal(DRAFT_KEY, value);
        return clone(value);
      }
    } catch (error) {
      console.warn("Не удалось загрузить рассадку с сервера, используется локальная копия", error);
    }
    return this.getLocalDraft();
  },

  async saveDraft(data) {
    const next = { ...clone(data), schemaVersion: SCHEMA_VERSION, updatedAt: new Date().toISOString() };
    writeLocal(DRAFT_KEY, next);
    await request("/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    return next;
  },

  async getPublished() {
    const value = normalize(await request("/published"));
    if (!value) return null;
    writeLocal(PUBLISHED_KEY, value);
    return clone(value);
  },

  async publish(data) {
    const next = { ...clone(data), schemaVersion: SCHEMA_VERSION, publishedAt: new Date().toISOString() };
    writeLocal(PUBLISHED_KEY, next);
    await request("/published", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    return next;
  },

  replaceDraft(data) {
    const next = normalize(data);
    if (!next) throw new Error("Неподдерживаемый или повреждённый JSON");
    writeLocal(DRAFT_KEY, next);
    return clone(next);
  },

  exportData: (data) => JSON.stringify(data, null, 2),
};
