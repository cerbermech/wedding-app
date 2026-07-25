export const SCHEMA_VERSION = 2;

export const createEmptySeating = () => ({
  schemaVersion: SCHEMA_VERSION,
  guests: [],
  tables: [],
  groups: [],
  seatMode: "list",
  updatedAt: new Date().toISOString(),
});

export const createGuest = (values = {}) => {
  const firstName = String(values.firstName || "").trim();
  const lastName = String(values.lastName || "").trim();
  return {
    id: values.id || crypto.randomUUID(),
    firstName,
    lastName,
    displayName: String(values.displayName || `${firstName} ${lastName}`).trim(),
    group: String(values.group || ""),
    side: ["groom", "bride", "shared"].includes(values.side) ? values.side : "",
    isChild: Boolean(values.isChild),
    note: String(values.note || ""),
    publicNote: String(values.publicNote || ""),
    showPublicProfile: Boolean(values.showPublicProfile),
    tableId: values.tableId || null,
    seatNumber: Number.isFinite(values.seatNumber) ? values.seatNumber : null,
    createdAt: values.createdAt || new Date().toISOString(),
  };
};

export const createTable = (values = {}, index = 0) => ({
  id: values.id || crypto.randomUUID(),
  name: String(values.name || `Стол ${index + 1}`),
  number: values.number === null ? null : Number.isFinite(Number(values.number)) ? Number(values.number) : index + 1,
  capacity: Math.max(0, Number(values.capacity) || 0),
  shape: ["round", "rectangle", "oval"].includes(values.shape) ? values.shape : "round",
  x: Number.isFinite(values.x) ? values.x : 50,
  y: Number.isFinite(values.y) ? values.y : 50,
  width: Number.isFinite(values.width) ? values.width : 110,
  height: Number.isFinite(values.height) ? values.height : 90,
  rotation: Number.isFinite(values.rotation) ? values.rotation : 0,
  isCoupleTable: Boolean(values.isCoupleTable),
  isPublic: values.isPublic !== false,
});

export const createGroup = (name, color = "#8daa91") => ({
  id: crypto.randomUUID(),
  name: String(name || "").trim(),
  color,
});
