import { Copy, Trash2 } from "lucide-react";

export default function InspectorPanel({ data, selectedGuest, selectedTable, selectionCount, onEditGuest, onDuplicateGuest, onDeleteGuests, onUpdateGuest, onUpdateTable, onDeleteTable, onReorder }) {
  if (selectedGuest) return <aside className="inspector-panel"><div className="panel-title"><h2>Гость</h2><span>{selectionCount > 1 ? `Выбрано: ${selectionCount}` : ""}</span></div><h3>{selectedGuest.displayName}</h3><p className="muted">{selectedGuest.group || "Без группы"}</p>
    <label>Назначить стол<select value={selectedGuest.tableId || ""} onChange={(e) => onUpdateGuest({ tableId: e.target.value || null, seatNumber: null })}><option value="">Не рассажен</option>{data.tables.map((table) => <option key={table.id} value={table.id}>{table.number ?? "—"} · {table.name}</option>)}</select></label>
    {selectedGuest.tableId && <label>Номер места<input type="number" min="1" value={selectedGuest.seatNumber ?? ""} onChange={(e) => onUpdateGuest({ seatNumber: e.target.value ? Number(e.target.value) : null })} /></label>}
    <div className="inspector-actions"><button onClick={onEditGuest}>Изменить</button><button onClick={onDuplicateGuest}><Copy size={15} /> Дублировать</button><button className="danger" onClick={onDeleteGuests}><Trash2 size={15} /> Удалить</button></div>
  </aside>;
  if (selectedTable) {
    const guests = data.guests.filter((guest) => guest.tableId === selectedTable.id).sort((a, b) => (a.seatNumber ?? 999) - (b.seatNumber ?? 999));
    return <aside className="inspector-panel"><div className="panel-title"><h2>Свойства стола</h2><span>{guests.length}/{selectedTable.capacity || "∞"}</span></div>
      <label>Название<input value={selectedTable.name} onChange={(e) => onUpdateTable({ name: e.target.value })} /></label>
      <div className="form-grid"><label>Номер<input type="number" value={selectedTable.number ?? ""} onChange={(e) => onUpdateTable({ number: e.target.value === "" ? null : Number(e.target.value) })} /></label><label>Вместимость<input type="number" min="0" value={selectedTable.capacity} onChange={(e) => onUpdateTable({ capacity: Math.max(0, Number(e.target.value)) })} /></label></div>
      <label>Форма<select value={selectedTable.shape} onChange={(e) => onUpdateTable({ shape: e.target.value })}><option value="round">Круглый</option><option value="rectangle">Прямоугольный</option><option value="oval">Овальный</option></select></label>
      <div className="form-grid"><label>Ширина<input type="range" min="70" max="220" value={selectedTable.width} onChange={(e) => onUpdateTable({ width: Number(e.target.value) })} /></label><label>Высота<input type="range" min="60" max="180" value={selectedTable.height} onChange={(e) => onUpdateTable({ height: Number(e.target.value) })} /></label></div>
      <label>Поворот<input type="range" min="-180" max="180" value={selectedTable.rotation} onChange={(e) => onUpdateTable({ rotation: Number(e.target.value) })} /></label>
      <label className="check"><input type="checkbox" checked={selectedTable.isCoupleTable} onChange={(e) => onUpdateTable({ isCoupleTable: e.target.checked })} /> Стол молодожёнов</label><label className="check"><input type="checkbox" checked={selectedTable.isPublic} onChange={(e) => onUpdateTable({ isPublic: e.target.checked })} /> Показывать публично</label>
      <h3>Гости за столом</h3><div className="table-guest-order">{guests.map((guest, index) => <div draggable onDragStart={(e) => e.dataTransfer.setData("text/order-index", String(index))} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onReorder(Number(e.dataTransfer.getData("text/order-index")), index)} key={guest.id}><span>{guest.seatNumber ?? index + 1}</span>{guest.displayName}</div>)}</div>
      <button className="danger wide-button" onClick={onDeleteTable}><Trash2 size={15} /> Удалить стол</button>
    </aside>;
  }
  return <aside className="inspector-panel empty-note">Выберите гостя или стол, чтобы открыть свойства.</aside>;
}
