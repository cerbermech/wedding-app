import { seatingStats } from "../utils/seatingValidation";

export default function SeatingStats({ data }) {
  const stats = seatingStats(data);
  return <div className="stats-row">{[["Всего", stats.total], ["Рассажено", stats.seated], ["Не рассажено", stats.unseated], ["Столов", stats.tables], ["Свободно", stats.free], ["Переполнено", stats.overflow]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>;
}
