import React, { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "./../styles/map.css";

export default function MapPage() {
  const [tab, setTab] = useState("map");

  // Координаты места свадьбы (пример — Москва, Красная площадь)
  const coords = [55.751574, 37.573856];
  const placeName = "Банкетный зал «Рустик Бохо»";
  const address = "Москва, Красная площадь, д.1";

  return (
    <div className="map-container">
      <h2>📍 Место проведения</h2>

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
        <YMaps>
          <Map
            defaultState={{ center: coords, zoom: 15 }}
            width="100%"
            height="300px"
          >
            <Placemark geometry={coords} properties={{ balloonContent: placeName }} />
          </Map>
        </YMaps>
      )}

      {tab === "taxi" && (
        <div className="taxi">
          <p>Хотите приехать с комфортом?</p>
          <a
            href={`https://3.redirect.appmetrica.yandex.com/route?end-lat=${coords[0]}&end-lon=${coords[1]}&appmetrica_tracking_id=1178268795219780156`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🚖 Вызвать Яндекс.Такси
          </a>
        </div>
      )}

      {tab === "parking" && (
        <div className="parking">
          <h3>🚗 Советы по парковке</h3>
          <ul>
            <li>Бесплатная парковка рядом с рестораном (20 мест).</li>
            <li>Платная охраняемая парковка в 200 метрах (100₽/час).</li>
            <li>Лучше приезжать за 15 минут до начала, чтобы успеть.</li>
          </ul>
        </div>
      )}
    </div>
  );
}