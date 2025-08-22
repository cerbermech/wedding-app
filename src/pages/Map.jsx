import React, { useState } from "react";
import "./../styles/map.css";
import YandexMap from "./YandexMap";

export default function MapPage() {
  const [tab, setTab] = useState("map");

  // Координаты места свадьбы
  const coords = [55.751574, 37.573856];
  const placeName = "Уважаемые гости";
  const address = "Свадьба будет проводиться в Екатеринбурге, но еще не знаем где)";

  return (
    <div className="map-container">
      <h2>Место проведения</h2>
      <p>{placeName}</p>
      <p>{address}</p>

      <div className="tabs">
        <button
          className={tab === "map" ? "active" : ""}
          onClick={() => setTab("map")}
        >
          Карта
        </button>
        <button
          className={tab === "taxi" ? "active" : ""}
          onClick={() => setTab("taxi")}
        >
          Вызвать такси
        </button>
        <button
          className={tab === "parking" ? "active" : ""}
          onClick={() => setTab("parking")}
        >
          Где припарковаться?
        </button>
      </div>

      {tab === "map" && (
        <YandexMap coords={coords} placeName={placeName} visible={tab === "map"} />
      )}
      {tab === "taxi" && (
        <div className="taxi">
          <p>Хотите приехать с комфортом?</p>
          <a
            href={`https://3.redirect.appmetrica.yandex.com/route?end-lat=${coords[0]}&end-lon=${coords[1]}&appmetrica_tracking_id=1178268795219780156`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            🚖 Вызвать Яндекс.Такси
          </a>
        </div>
      )}

      {tab === "parking" && (
        <div className="parking">
          <h3>🚗Советы по парковке</h3>
          <ul>
            <li>Когда будем знать место, тогда будем давать советы</li>
          </ul>
        </div>
      )}
    </div>
  );
}