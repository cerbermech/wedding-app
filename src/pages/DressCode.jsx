import "./../styles/dresscode.css";
import dressCodeImage from "../assets/dresscode.png";

export default function DressCode() {
  return (
    <div className="dresscode-container">


      <section className="dresscode-card" aria-label="Информация о дресс-коде">
        <div className="dresscode-image-frame">
          <img src={dressCodeImage} alt="Дресс-код: примерные наряды и палитра свадьбы" className="dresscode-image" />
        </div>

        <p className="dresscode-note">
          Просим по возможности избегать полностью чёрных и полностью белых образов.
        </p>
      </section>
    </div>
  );
}
