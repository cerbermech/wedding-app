import { useEffect, useMemo, useRef, useState } from "react";
import { LockKeyhole, Palette, Plus, Trash2, X } from "lucide-react";
import BulkGuestImport from "../components/BulkGuestImport";
import GuestForm from "../components/GuestForm";
import GuestList from "../components/GuestList";
import InspectorPanel from "../components/InspectorPanel";
import SeatingPrintView from "../components/SeatingPrintView";
import SeatingStats from "../components/SeatingStats";
import SeatingToolbar from "../components/SeatingToolbar";
import TableCanvas from "../components/TableCanvas";
import { createGroup, createGuest, createTable } from "../data/seatingDefaults";
import { seatingRepository } from "../data/seatingRepository";
import { useUndoHistory } from "../hooks/useUndoHistory";
import { downloadText, exportGuestsCsv, importGuestsCsv } from "../utils/seatingImportExport";
import { validateSeating } from "../utils/seatingValidation";
import "../../../styles/seatingEditor.css";

const ADMIN_PIN = import.meta.env.VITE_SEATING_ADMIN_PIN;
const initialFilters = { query: "", status: "all", group: "", table: "", sort: "firstName" };

export default function SeatingAdminPage() {
  const [allowed, setAllowed] = useState(() => sessionStorage.getItem("seating-admin") === "yes");
  const [pin, setPin] = useState("");
  const history = useUndoHistory(seatingRepository.getLocalDraft(), 20);
  const replaceHistory = history.replace;
  const data = history.value;
  const [selection, setSelection] = useState(new Set());
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [dialog, setDialog] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Сохранено");
  const [initialized, setInitialized] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("guests");
  const importRef = useRef(null);

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    setSaveStatus("Загрузка с сервера");
    seatingRepository.getDraft().then((serverDraft) => {
      if (!active) return;
      replaceHistory(serverDraft, false);
      setInitialized(true);
      setSaveStatus("Сохранено");
    });
    return () => { active = false; };
  }, [allowed, replaceHistory]);

  useEffect(() => {
    if (!allowed || !initialized) return undefined;
    setSaveStatus("Сохраняется");
    const timeout = setTimeout(() => {
      seatingRepository.saveDraft(data)
        .then(() => setSaveStatus("Сохранено на сервере"))
        .catch(() => setSaveStatus("Ошибка сохранения на сервере"));
    }, 350);
    return () => clearTimeout(timeout);
  }, [data, allowed, initialized]);

  const deleteSelection = () => {
    if (!selection.size || !confirm(`Удалить выбранных гостей: ${selection.size}?`)) return;
    history.commit((next) => { next.guests = next.guests.filter((guest) => !selection.has(guest.id)); });
    setSelection(new Set());
  };
  useEffect(() => {
    const keyboard = (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? history.redo() : history.undo(); }
      else if (!typing && event.key === "Delete") deleteSelection();
      else if (event.key === "Escape") { setSelection(new Set()); setSelectedTableId(null); setDialog(null); }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  });

  const tableMap = useMemo(() => new Map(data.tables.map((table) => [table.id, table])), [data.tables]);
  const visibleGuests = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = data.guests.filter((guest) => {
      const table = tableMap.get(guest.tableId);
      const searchable = [guest.firstName, guest.lastName, guest.displayName, guest.group, guest.note, table?.number, table?.name].join(" ").toLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (filters.group && guest.group !== filters.group) return false;
      if (filters.table && guest.tableId !== filters.table) return false;
      if (filters.status === "unseated" && guest.tableId) return false;
      if (filters.status === "seated" && !guest.tableId) return false;
      if (["groom", "bride", "shared"].includes(filters.status) && guest.side !== filters.status) return false;
      return filters.status !== "children" || guest.isChild;
    });
    return list.sort((a, b) => {
      if (filters.sort === "table") return String(tableMap.get(a.tableId)?.number ?? 999).localeCompare(String(tableMap.get(b.tableId)?.number ?? 999));
      return String(a[filters.sort] || "").localeCompare(String(b[filters.sort] || ""), "ru");
    });
  }, [data.guests, filters, tableMap]);
  const selectedGuest = selection.size === 1 ? data.guests.find((guest) => selection.has(guest.id)) : null;
  const searchHighlightedGuest = selectedGuest || (filters.query.trim() && visibleGuests.length === 1 ? visibleGuests[0] : null);
  const selectedTable = data.tables.find((table) => table.id === selectedTableId);

  const selectGuest = (id, additive) => {
    setSelectedTableId(null);
    setSelection((current) => {
      if (!additive) return new Set([id]);
      const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next;
    });
    setMobilePanel("properties");
  };
  const assignGuests = (ids, tableId) => history.commit((next) => {
    next.guests.forEach((guest) => {
      if (ids.includes(guest.id)) { guest.tableId = tableId; guest.seatNumber = null; }
    });
  });
  const dropGuests = (event, tableId) => {
    const dragged = event.dataTransfer.getData("text/guest-id");
    const ids = selection.has(dragged) ? [...selection] : [dragged];
    assignGuests(ids.filter(Boolean), tableId === "__none" ? null : tableId);
  };
  const saveGuest = (values) => {
    if (editingGuest) history.commit((next) => Object.assign(next.guests.find((guest) => guest.id === editingGuest.id), createGuest({ ...editingGuest, ...values, id: editingGuest.id })));
    else history.commit((next) => next.guests.push(createGuest(values)));
    setDialog(null); setEditingGuest(null);
  };
  const duplicateGuest = () => {
    if (!selectedGuest) return;
    const copy = createGuest({ ...selectedGuest, id: undefined, displayName: `${selectedGuest.displayName} — копия`, tableId: null, seatNumber: null });
    history.commit((next) => next.guests.push(copy)); setSelection(new Set([copy.id]));
  };
  const addBulk = (names) => {
    history.commit((next) => names.forEach((name) => {
      const parts = name.split(" "); next.guests.push(createGuest({ firstName: parts.shift(), lastName: parts.join(" ") }));
    }));
    setDialog(null);
  };
  const addTable = () => {
    const table = createTable({}, data.tables.length);
    history.commit((next) => next.tables.push(table)); setSelectedTableId(table.id); setSelection(new Set()); setMobilePanel("hall");
  };
  const deleteTable = () => {
    if (!selectedTable || !confirm(`Удалить «${selectedTable.name}»? Гости станут нерассаженными.`)) return;
    history.commit((next) => { next.guests.forEach((guest) => { if (guest.tableId === selectedTable.id) { guest.tableId = null; guest.seatNumber = null; } }); next.tables = next.tables.filter((table) => table.id !== selectedTable.id); });
    setSelectedTableId(null);
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    try {
      const incoming = file.name.toLowerCase().endsWith(".csv") ? importGuestsCsv(await file.text()) : null;
      const mode = prompt("Введите «добавить» или «заменить». Для отмены оставьте поле пустым.", "добавить");
      if (!mode) return;
      if (incoming) history.commit((next) => { next.guests = mode.toLowerCase().startsWith("зам") ? incoming : [...next.guests, ...incoming]; });
      else {
        const parsed = JSON.parse(await file.text());
        if (mode.toLowerCase().startsWith("зам")) history.replace(seatingRepository.replaceDraft(parsed));
        else history.commit((next) => { next.guests.push(...(parsed.guests || []).map((guest) => createGuest({ ...guest, id: crypto.randomUUID(), tableId: null }))); next.tables.push(...(parsed.tables || []).map((table) => createTable({ ...table, id: crypto.randomUUID() }, next.tables.length))); });
      }
    } catch (error) { alert(`Импорт не выполнен: ${error.message}`); }
  };
  const publish = async () => {
    const validation = validateSeating(data);
    if (validation.errors.length) return alert(`Публикация невозможна:\n${validation.errors.join("\n")}`);
    if (validation.unseated && !confirm(`В рассадке остаются ${validation.unseated} нерассаженных гостя. Всё равно опубликовать?`)) return;
    try {
      await seatingRepository.publish(data);
      alert("Рассадка опубликована на сервере");
    } catch (error) {
      alert(`Не удалось опубликовать рассадку: ${error.message}`);
    }
  };
  const assignSelectedGroup = (group) => history.commit((next) => next.guests.forEach((guest) => { if (selection.has(guest.id)) guest.group = group; }));

  if (!allowed) return <main className="pin-page"><form onSubmit={(e) => { e.preventDefault(); if (!ADMIN_PIN) return; if (pin === ADMIN_PIN) { sessionStorage.setItem("seating-admin", "yes"); setAllowed(true); } else alert("Неверный PIN"); }}><LockKeyhole size={38} /><h1>Редактор рассадки</h1>{ADMIN_PIN ? <><p>Закрытый раздел для молодожёнов</p><input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN-код" autoFocus /><button>Войти</button></> : <p className="warning">Задайте VITE_SEATING_ADMIN_PIN в файле .env.local и перезапустите приложение.</p>}</form></main>;

  return <main className="seating-editor">
    <SeatingToolbar saveStatus={saveStatus} onAddGuest={() => { setEditingGuest(null); setDialog("guest"); }} onBulkGuests={() => setDialog("bulk")} onAddTable={addTable} onUndo={history.undo} onRedo={history.redo} onSave={async () => { try { await seatingRepository.saveDraft(data); setSaveStatus("Сохранено на сервере"); } catch { setSaveStatus("Ошибка сохранения на сервере"); } }} onImport={() => importRef.current.click()} onExport={() => { downloadText(seatingRepository.exportData(data), "seating-draft.json", "application/json"); downloadText(exportGuestsCsv(data.guests), "seating-guests.csv", "text/csv;charset=utf-8"); }} onPrint={() => window.print()} onPublish={publish} />
    <input hidden type="file" ref={importRef} accept=".json,.csv,application/json,text/csv" onChange={importFile} />
    <SeatingStats data={data} />
    <nav className="mobile-editor-nav">{[["guests", "Гости"], ["hall", "Зал"], ["properties", "Свойства"]].map(([id, label]) => <button className={mobilePanel === id ? "active" : ""} onClick={() => setMobilePanel(id)} key={id}>{label}</button>)}</nav>
    {selection.size > 1 && <div className="bulk-bar"><strong>Выбрано: {selection.size}</strong><select onChange={(e) => { assignSelectedGroup(e.target.value); e.target.value = ""; }} defaultValue=""><option value="" disabled>Назначить группу</option>{data.groups.map((group) => <option key={group.id}>{group.name}</option>)}</select><select onChange={(e) => { assignGuests([...selection], e.target.value === "__none" ? null : e.target.value); e.target.value = ""; }} defaultValue=""><option value="" disabled>Назначить стол</option><option value="__none">Не рассажены</option>{data.tables.map((table) => <option value={table.id} key={table.id}>{table.name}</option>)}</select><button className="danger" onClick={deleteSelection}>Удалить</button><button onClick={() => setSelection(new Set())}><X size={15} /></button></div>}
    <section className="editor-grid">
      <div className={`mobile-panel ${mobilePanel === "guests" ? "mobile-active" : ""}`}><GuestList guests={visibleGuests} tables={data.tables} groups={data.groups} selection={selection} filters={filters} setFilters={setFilters} onSelect={selectGuest} highlightedId={searchHighlightedGuest?.id} onDragStart={(e, id) => e.dataTransfer.setData("text/guest-id", id)} /><div className="group-manager"><div className="panel-title"><h3>Группы</h3><button onClick={() => { const name = prompt("Название группы"); if (name) history.commit((next) => next.groups.push(createGroup(name))); }}><Plus size={14} /></button></div>{data.groups.map((group) => <div key={group.id}><input type="color" value={group.color} onChange={(e) => history.commit((next) => { next.groups.find((item) => item.id === group.id).color = e.target.value; })} /><button onClick={() => { const name = prompt("Новое название", group.name); if (name) history.commit((next) => { next.guests.forEach((guest) => { if (guest.group === group.name) guest.group = name; }); next.groups.find((item) => item.id === group.id).name = name; }); }}>{group.name}</button><button className="icon-danger" onClick={() => { if (confirm(`Удалить группу «${group.name}»?`)) history.commit((next) => { next.guests.forEach((guest) => { if (guest.group === group.name) guest.group = ""; }); next.groups = next.groups.filter((item) => item.id !== group.id); }); }}><Trash2 size={13} /></button></div>)}{!data.groups.length && <small><Palette size={13} /> Групп пока нет</small>}</div></div>
      <div className={`canvas-column mobile-panel ${mobilePanel === "hall" ? "mobile-active" : ""}`}><div className="canvas-mode"><button className={data.seatMode === "list" ? "active" : ""} onClick={() => history.commit((next) => { next.seatMode = "list"; })}>Список</button><button className={data.seatMode === "seats" ? "active" : ""} onClick={() => history.commit((next) => { next.seatMode = "seats"; })}>Места</button></div><TableCanvas data={data} selectedTableId={searchHighlightedGuest?.tableId || selectedTableId} highlightedGuestId={searchHighlightedGuest?.id} onSelectTable={(id) => { setSelectedTableId(id); setSelection(new Set()); setMobilePanel("properties"); }} onDropGuests={dropGuests} onMoveTable={(id, x, y) => history.commit((next) => Object.assign(next.tables.find((table) => table.id === id), { x, y }))} /></div>
      <div className={`mobile-panel ${mobilePanel === "properties" ? "mobile-active" : ""}`}><InspectorPanel data={data} selectedGuest={selectedGuest} selectedTable={selectedTable} selectionCount={selection.size} onEditGuest={() => { setEditingGuest(selectedGuest); setDialog("guest"); }} onDuplicateGuest={duplicateGuest} onDeleteGuests={deleteSelection} onUpdateGuest={(patch) => history.commit((next) => { const guest = next.guests.find((item) => item.id === selectedGuest.id); if (patch.seatNumber && guest.tableId) { const occupant = next.guests.find((item) => item.id !== guest.id && item.tableId === guest.tableId && item.seatNumber === patch.seatNumber); if (occupant) occupant.seatNumber = guest.seatNumber; } Object.assign(guest, patch); })} onUpdateTable={(patch) => history.commit((next) => Object.assign(next.tables.find((table) => table.id === selectedTable.id), patch))} onDeleteTable={deleteTable} onReorder={(from, to) => history.commit((next) => { const guests = next.guests.filter((guest) => guest.tableId === selectedTable.id).sort((a, b) => (a.seatNumber ?? 999) - (b.seatNumber ?? 999)); const [moved] = guests.splice(from, 1); guests.splice(to, 0, moved); guests.forEach((guest, index) => { guest.seatNumber = index + 1; }); })} /></div>
    </section>
    <SeatingPrintView data={data} />
    {dialog && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setDialog(null)}><div className="editor-modal"><button className="modal-close" onClick={() => setDialog(null)}><X /></button><h2>{dialog === "bulk" ? "Добавить гостей списком" : editingGuest ? "Изменить гостя" : "Новый гость"}</h2>{dialog === "bulk" ? <BulkGuestImport existingGuests={data.guests} onAdd={addBulk} onCancel={() => setDialog(null)} /> : <GuestForm guest={editingGuest} groups={data.groups} onSave={saveGuest} onCancel={() => setDialog(null)} />}</div></div>}
  </main>;
}
