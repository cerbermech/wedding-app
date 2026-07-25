import { useRef } from "react";

export default function TableCanvas({ data, selectedTableId, highlightedGuestId, onSelectTable, onDropGuests, onMoveTable }) {
  const drag = useRef({ id: null });
  const beginMove = (event, table) => {
    if (event.target.closest(".table-guests")) return;
    drag.current.id = table.id;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event) => {
    if (!drag.current.id) return;
    const rect = event.currentTarget.parentElement.getBoundingClientRect();
    onMoveTable(drag.current.id, Math.max(4, Math.min(96, ((event.clientX - rect.left) / rect.width) * 100)), Math.max(5, Math.min(95, ((event.clientY - rect.top) / rect.height) * 100)));
  };
  return <section className="hall-canvas" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { if (e.currentTarget === e.target) onDropGuests(e, null); }}>
    <div className="hall-label">Схема зала</div>
    {data.tables.map((table) => {
      const guests = data.guests.filter((guest) => guest.tableId === table.id).sort((a, b) => (a.seatNumber ?? 999) - (b.seatNumber ?? 999));
      const overflow = table.capacity > 0 && guests.length > table.capacity;
      return <div role="button" tabIndex="0" key={table.id} className={`canvas-table shape-${table.shape} ${selectedTableId === table.id ? "selected" : ""} ${overflow ? "overflow" : ""}`} style={{ left: `${table.x}%`, top: `${table.y}%`, width: table.width, height: table.height, transform: `translate(-50%,-50%) rotate(${table.rotation}deg)` }} onClick={() => onSelectTable(table.id)} onPointerDown={(e) => beginMove(e, table)} onPointerMove={move} onPointerUp={() => { drag.current.id = null; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.stopPropagation(); onDropGuests(e, table.id); }}>
        <div className="table-caption"><strong>{table.number === null ? "—" : table.number}</strong><span>{guests.length} / {table.capacity || "∞"}</span></div>
        {data.seatMode === "seats" ? <div className="seat-orbit">{Array.from({ length: Math.max(table.capacity || guests.length, guests.length) }, (_, index) => {
          const guest = guests.find((item) => item.seatNumber === index + 1) || guests[index];
          const angle = (index / Math.max(table.capacity || guests.length, 1)) * Math.PI * 2;
          return <span title={guest?.displayName || `Место ${index + 1}`} className={guest?.id === highlightedGuestId ? "highlighted" : ""} style={{ left: `${50 + Math.cos(angle) * 58}%`, top: `${50 + Math.sin(angle) * 58}%` }} key={index}>{index + 1}</span>;
        })}</div> : <div className="table-guests">{guests.slice(0, 5).map((guest) => <span className={guest.id === highlightedGuestId ? "highlighted" : ""} key={guest.id}>{guest.displayName}</span>)}{guests.length > 5 && <span>+{guests.length - 5}</span>}</div>}
      </div>;
    })}
    {!data.tables.length && <div className="canvas-empty">Создайте первый стол</div>}
  </section>;
}
