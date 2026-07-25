import { createGuest } from "../data/seatingDefaults";

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function exportGuestsCsv(guests) {
  const header = "name,group,side,isChild,note";
  return [header, ...guests.map((guest) => [
    csvEscape(guest.displayName), csvEscape(guest.group), csvEscape(guest.side),
    guest.isChild ? "true" : "false", csvEscape(guest.note),
  ].join(","))].join("\r\n");
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { values.push(value.trim()); value = ""; }
    else value += char;
  }
  values.push(value.trim());
  return values;
}

export function importGuestsCsv(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim()).map(parseCsvLine);
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.toLowerCase());
  const index = (name) => headers.indexOf(name.toLowerCase());
  if (index("name") < 0) throw new Error("В CSV отсутствует обязательная колонка name");
  return rows.filter((row) => row[index("name")]?.trim()).map((row) => {
    const name = row[index("name")].trim().split(/\s+/);
    return createGuest({
      firstName: name.shift(),
      lastName: name.join(" "),
      group: row[index("group")] || "",
      side: row[index("side")] || "",
      isChild: ["true", "1", "да"].includes((row[index("isChild")] || "").toLowerCase()),
      note: row[index("note")] || "",
    });
  });
}

export function downloadText(text, filename, type) {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
