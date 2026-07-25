import { useEffect, useState } from "react";
import { MapPin, Search, UsersRound } from "lucide-react";
import { seatingRepository } from "../data/seatingRepository";
import "../../../styles/seatingPublic.css";

export default function SeatingPublicPage() {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    let active = true;
    seatingRepository.getPublished()
      .then((value) => { if (active) setData(value); })
      .catch((error) => { console.error("Ошибка загрузки рассадки:", error); if (active) setData(null); });
    return () => { active = false; };
  }, []);
  const [query, setQuery] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  if (data === undefined) return <main className="public-seating empty-public"><UsersRound size={48} /><h1>Загружаем рассадку…</h1></main>;
  if (!data) return <main className="public-seating empty-public"><UsersRound size={48} /><h1>Рассадка пока не опубликована</h1><p>Загляните сюда немного позже.</p></main>;
  const publicTables = data.tables.filter((table) => table.isPublic);
  const publicTableIds = new Set(publicTables.map((table) => table.id));
  const matches = query.trim() ? data.guests.filter((guest) => publicTableIds.has(guest.tableId) && [guest.firstName, guest.lastName, guest.displayName, guest.group].join(" ").toLowerCase().includes(query.trim().toLowerCase())).slice(0, 10) : [];
  const selectedGuest = data.guests.find((guest) => guest.id === selectedGuestId);
  const selectedTable = publicTables.find((table) => table.id === (selectedGuest?.tableId || selectedTableId));
  const tableGuests = selectedTable ? data.guests.filter((guest) => guest.tableId === selectedTable.id).sort((a, b) => (a.seatNumber ?? 999) - (b.seatNumber ?? 999)) : [];
  const chooseGuest = (guest) => { setSelectedGuestId(guest.id); setSelectedTableId(guest.tableId); setQuery(guest.displayName); };
  return <main className="public-seating">
    <header className="public-hero"><p className="eyebrow">Максим & Елена</p><h1>Найдите своё место</h1><p>Введите имя — мы покажем ваш стол и соседей</p></header>
    <div className="public-search"><Search size={20} /><input aria-label="Найти гостя" value={query} onChange={(e) => { setQuery(e.target.value); setSelectedGuestId(null); }} placeholder="Имя или фамилия" />{query && !selectedGuest && <div className="public-results">{matches.map((guest) => <button onClick={() => chooseGuest(guest)} key={guest.id}><strong>{guest.displayName}</strong><span>{publicTables.find((table) => table.id === guest.tableId)?.name || "Стол не указан"}</span></button>)}{!matches.length && <p>Гость не найден</p>}</div>}</div>
    {selectedGuest && selectedTable && <section className="guest-result"><div><span>Ваш стол</span><strong>№{selectedTable.number ?? "—"}</strong></div><div><span>Название</span><strong>{selectedTable.name}</strong></div>{selectedGuest.seatNumber && <div><span>Ваше место</span><strong>{selectedGuest.seatNumber}</strong></div>}<button onClick={() => document.getElementById(`public-table-${selectedTable.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}><MapPin size={17} /> Показать стол на схеме</button>{selectedGuest.showPublicProfile && selectedGuest.publicNote && <p>{selectedGuest.publicNote}</p>}</section>}
    <section className="public-layout"><div className="public-hall">{publicTables.map((table) => {
      const count = data.guests.filter((guest) => guest.tableId === table.id).length;
      return <button id={`public-table-${table.id}`} key={table.id} className={`public-table shape-${table.shape} ${selectedTable?.id === table.id ? "selected" : ""}`} style={{ left: `${table.x}%`, top: `${table.y}%`, width: table.width, height: table.height, transform: `translate(-50%,-50%) rotate(${table.rotation}deg)` }} onClick={() => { setSelectedTableId(table.id); setSelectedGuestId(null); }}><strong>{table.number ?? "—"}</strong><span>{table.name}</span><small>{count} гостей</small></button>;
    })}{!publicTables.length && <p className="public-empty-hall">В опубликованной версии нет публичных столов</p>}</div>
      <aside className="public-table-card">{selectedTable ? <><p className="eyebrow">Стол №{selectedTable.number ?? "—"}</p><h2>{selectedTable.name}</h2><h3>{selectedGuest ? "За вашим столом" : "Гости за столом"}</h3><ul>{tableGuests.map((guest) => <li className={guest.id === selectedGuestId ? "you" : ""} key={guest.id}><span>{guest.seatNumber || "•"}</span><div><strong>{guest.displayName}</strong>{guest.showPublicProfile && guest.publicNote && <small>{guest.publicNote}</small>}</div></li>)}</ul></> : <div className="choose-table">Выберите стол на схеме</div>}</aside>
    </section>
    <section className="public-table-list"><h2>Список столов</h2>{publicTables.map((table) => <button key={table.id} onClick={() => { setSelectedTableId(table.id); setSelectedGuestId(null); }}><strong>№{table.number ?? "—"}</strong><span>{table.name}</span><small>{data.guests.filter((guest) => guest.tableId === table.id).length} гостей</small></button>)}</section>
  </main>;
}
