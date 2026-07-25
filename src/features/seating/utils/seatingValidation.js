export function validateSeating(data) {
  const errors = [];
  const warnings = [];
  if (!data || !Array.isArray(data.guests) || !Array.isArray(data.tables) || !Array.isArray(data.groups)) {
    return { errors: ["Структура данных повреждена"], warnings: [] };
  }
  const guestIds = data.guests.map((guest) => guest.id);
  const tableIds = new Set(data.tables.map((table) => table.id));
  if (new Set(guestIds).size !== guestIds.length) errors.push("У гостей обнаружены повторяющиеся ID");
  data.guests.forEach((guest) => {
    if (!guest.id || !guest.displayName?.trim()) errors.push("У гостя отсутствует ID или имя");
    if (guest.tableId && !tableIds.has(guest.tableId)) errors.push(`${guest.displayName}: назначенный стол не существует`);
  });
  data.tables.forEach((table) => {
    const count = data.guests.filter((guest) => guest.tableId === table.id).length;
    if (table.capacity > 0 && count > table.capacity) errors.push(`${table.name}: ${count}/${table.capacity}, стол переполнен`);
    if (!table.capacity) warnings.push(`${table.name}: вместимость не ограничена`);
  });
  const unseated = data.guests.filter((guest) => !guest.tableId).length;
  if (unseated) warnings.push(`Не рассажено гостей: ${unseated}`);
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)], unseated };
}

export function seatingStats(data) {
  const seated = data.guests.filter((guest) => guest.tableId).length;
  const finiteTables = data.tables.filter((table) => table.capacity > 0);
  const free = finiteTables.reduce((sum, table) => sum + Math.max(0, table.capacity - data.guests.filter((guest) => guest.tableId === table.id).length), 0);
  const overflow = finiteTables.filter((table) => data.guests.filter((guest) => guest.tableId === table.id).length > table.capacity).length;
  return { total: data.guests.length, seated, unseated: data.guests.length - seated, tables: data.tables.length, free, overflow };
}
