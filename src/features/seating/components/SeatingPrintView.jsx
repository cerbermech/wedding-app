export default function SeatingPrintView({ data }) {
  const alphabetical = [...data.guests].sort((a, b) => a.displayName.localeCompare(b.displayName, "ru"));
  return <section className="seating-print">
    <h1>Рассадка гостей</h1><h2>Гости по алфавиту</h2><table><tbody>{alphabetical.map((guest) => { const table = data.tables.find((item) => item.id === guest.tableId); return <tr key={guest.id}><td>{guest.displayName}</td><td>{table ? `Стол №${table.number ?? "—"} · ${table.name}` : "Не рассажен"}</td></tr>; })}</tbody></table>
    <h2>Столы</h2>{data.tables.map((table) => <article key={table.id}><h3>№{table.number ?? "—"} · {table.name}</h3><ol>{data.guests.filter((guest) => guest.tableId === table.id).sort((a, b) => (a.seatNumber ?? 999) - (b.seatNumber ?? 999)).map((guest) => <li key={guest.id}>{guest.displayName}{guest.seatNumber ? ` — место ${guest.seatNumber}` : ""}</li>)}</ol></article>)}
  </section>;
}
