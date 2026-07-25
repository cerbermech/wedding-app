import { useEffect, useState } from "react";

const empty = { firstName: "", lastName: "", displayName: "", group: "", side: "", isChild: false, note: "", publicNote: "", showPublicProfile: false };

export default function GuestForm({ guest, groups, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [manualDisplay, setManualDisplay] = useState(false);
  useEffect(() => { setForm(guest || empty); setManualDisplay(Boolean(guest?.displayName)); }, [guest]);
  const change = (field, value) => setForm((current) => {
    const next = { ...current, [field]: value };
    if (!manualDisplay && ["firstName", "lastName"].includes(field)) next.displayName = `${next.firstName} ${next.lastName}`.trim();
    return next;
  });
  return <form className="editor-form" onSubmit={(event) => { event.preventDefault(); if (form.firstName.trim() || form.displayName.trim()) onSave(form); }}>
    <div className="form-grid"><label>Имя *<input value={form.firstName} onChange={(e) => change("firstName", e.target.value)} autoFocus /></label><label>Фамилия<input value={form.lastName} onChange={(e) => change("lastName", e.target.value)} /></label></div>
    <label>Отображаемое имя<input value={form.displayName} onChange={(e) => { setManualDisplay(true); change("displayName", e.target.value); }} /></label>
    <div className="form-grid"><label>Группа<select value={form.group} onChange={(e) => change("group", e.target.value)}><option value="">Без группы</option>{groups.map((group) => <option key={group.id}>{group.name}</option>)}</select></label><label>Сторона<select value={form.side} onChange={(e) => change("side", e.target.value)}><option value="">Не указана</option><option value="groom">Жених</option><option value="bride">Невеста</option><option value="shared">Общие</option></select></label></div>
    <label className="check"><input type="checkbox" checked={form.isChild} onChange={(e) => change("isChild", e.target.checked)} /> Ребёнок</label>
    <label>Заметка администратора<textarea value={form.note} onChange={(e) => change("note", e.target.value)} /></label>
    <label>Публичная заметка<textarea value={form.publicNote} onChange={(e) => change("publicNote", e.target.value)} /></label>
    <label className="check"><input type="checkbox" checked={form.showPublicProfile} onChange={(e) => change("showPublicProfile", e.target.checked)} /> Показывать публичную заметку</label>
    <div className="form-actions"><button type="button" onClick={onCancel}>Отмена</button><button className="primary">Сохранить</button></div>
  </form>;
}
