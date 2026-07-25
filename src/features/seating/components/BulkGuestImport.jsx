import { useMemo, useState } from "react";

export default function BulkGuestImport({ existingGuests, onAdd, onCancel }) {
  const [text, setText] = useState("");
  const names = useMemo(() => text.split(/\r?\n/).map((name) => name.trim().replace(/\s+/g, " ")).filter(Boolean), [text]);
  const existing = new Set(existingGuests.map((guest) => guest.displayName.toLowerCase()));
  const duplicates = names.filter((name) => existing.has(name.toLowerCase()));
  return <div className="bulk-import"><label>По одному гостю в строке<textarea rows="10" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Данил Циганков\nОлеся\nМарат Хаюмов"} /></label><strong>Будет добавлено гостей: {names.length}</strong>{duplicates.length > 0 && <p className="warning">Возможные дубликаты: {duplicates.join(", ")}</p>}<div className="form-actions"><button onClick={onCancel}>Отмена</button><button className="primary" disabled={!names.length} onClick={() => { if (!duplicates.length || confirm("Добавить возможные дубликаты?")) onAdd(names); }}>Добавить</button></div></div>;
}
