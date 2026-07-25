import { CheckSquare, Square } from "lucide-react";

const sideLabel = { groom: "Жених", bride: "Невеста", shared: "Общие", "": "Без стороны" };

export default function GuestList({ guests, tables, groups, selection, filters, setFilters, onSelect, onDragStart, highlightedId }) {
  const tableMap = new Map(tables.map((table) => [table.id, table]));
  return <aside className="guest-list-panel">
    <div className="panel-title"><h2>Список гостей</h2><span>{guests.length}</span></div>
    <input className="full-input" placeholder="Поиск по гостям и столам" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
    <div className="compact-filters">
      <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="all">Все</option><option value="unseated">Не рассажены</option><option value="seated">Рассажены</option><option value="groom">Сторона жениха</option><option value="bride">Сторона невесты</option><option value="shared">Общие</option><option value="children">Дети</option></select>
      <select value={filters.group} onChange={(e) => setFilters({ ...filters, group: e.target.value })}><option value="">Все группы</option>{groups.map((group) => <option key={group.id}>{group.name}</option>)}</select>
      <select value={filters.table} onChange={(e) => setFilters({ ...filters, table: e.target.value })}><option value="">Все столы</option>{tables.map((table) => <option value={table.id} key={table.id}>{table.name}</option>)}</select>
      <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="firstName">По имени</option><option value="lastName">По фамилии</option><option value="group">По группе</option><option value="table">По столу</option><option value="createdAt">По добавлению</option></select>
    </div>
    <h3>Не рассажены · {guests.filter((guest) => !guest.tableId).length}</h3>
    <div className="guest-list">{guests.map((guest) => {
      const selected = selection.has(guest.id);
      const group = groups.find((item) => item.name === guest.group);
      return <button type="button" draggable key={guest.id} className={`guest-card ${selected ? "selected" : ""} ${highlightedId === guest.id ? "highlighted" : ""}`} onClick={(e) => onSelect(guest.id, e.ctrlKey || e.metaKey || e.shiftKey)} onDragStart={(e) => onDragStart(e, guest.id)} style={{ "--group-color": group?.color || "#b9ccb9" }}>
        {selected ? <CheckSquare size={17} /> : <Square size={17} />}<span><strong>{guest.displayName}</strong><small>{guest.group || sideLabel[guest.side]}</small></span><em>{guest.tableId ? tableMap.get(guest.tableId)?.number ?? "Стол" : "Не рассажен"}</em>
      </button>;
    })}{!guests.length && <p className="empty-note">Гостей по этим условиям нет</p>}</div>
  </aside>;
}
