import { Flame, Waves } from "lucide-react";
import "./../styles/secondDay.css";

export default function SecondDay() {
  return (
    <main className="second-day-container">
      <h2 className="second-day-title">Второй день</h2>

      <section className="second-day-card">
        <div className="second-day-icons" aria-hidden="true">
          <Flame size={34} strokeWidth={1.7} />
          <Waves size={34} strokeWidth={1.7} />
        </div>
        <h3>Продолжаем праздник!</h3>
        <p>
          На второй день планируются шашлыки и баня в соседнем коттедже.
          Если хотите присоединиться, пожалуйста, заранее подготовьте купальные принадлежности.
        </p>
      </section>
    </main>
  );
}
