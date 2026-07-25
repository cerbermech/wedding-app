import { Download, Plus, Printer, Redo2, Save, Undo2, Upload, UserPlus, Users } from "lucide-react";

export default function SeatingToolbar({ saveStatus, onAddGuest, onBulkGuests, onAddTable, onUndo, onRedo, onSave, onImport, onExport, onPrint, onPublish }) {
  return <header className="seating-toolbar"><div className="toolbar-brand"><p className="eyebrow">Редактор рассадки</p><h1>Конструктор зала</h1></div><div className={`save-state ${saveStatus === "Ошибка сохранения" ? "error" : ""}`}>{saveStatus}</div><div className="toolbar-buttons">
    <button onClick={onAddGuest}><UserPlus size={16} /> Гость</button><button onClick={onBulkGuests}><Users size={16} /> Списком</button><button onClick={onAddTable}><Plus size={16} /> Стол</button>
    <button title="Отменить" onClick={onUndo}><Undo2 size={16} /></button><button title="Повторить" onClick={onRedo}><Redo2 size={16} /></button><button onClick={onSave}><Save size={16} /> Сохранить</button>
    <button onClick={onImport}><Upload size={16} /> Импорт</button><button onClick={onExport}><Download size={16} /> Экспорт</button><button onClick={onPrint}><Printer size={16} /> Печать / PDF</button><button className="primary" onClick={onPublish}>Опубликовать</button>
  </div></header>;
}
