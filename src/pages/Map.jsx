import { useState } from "react";
import { CarTaxiFront, ExternalLink, MapPin, Navigation, ParkingCircle } from "lucide-react";
import "./../styles/map.css";
import YandexMap from "./YandexMap";

const venuePhotos = [
  {
    src: "https://avatars.mds.yandex.net/get-altay/6382111/2a00000183f4b1178abe1ba300bb1e24e1d2/orig",
    alt: "Серебряный Родник, фасад и территория площадки",
  },
  {
    src: "https://marin-dom.ru/images/serebrjanyj-rodnik/34.jpg",
    alt: "Серебряный Родник, банкетное пространство",
  },
  {
    src: "https://marin-dom.ru/images/serebrjanyj-rodnik/32.jpg",
    alt: "Серебряный Родник, зона отдыха",
  },
  {
    src: "https://cdn1.flamp.ru/036a603733d488711b037c623a25fa2a_600_600.jpg",
    alt: "Серебряный Родник, интерьер площадки",
  },
  {
    src: "https://img.arendazala.net/bzstqapv8FJYfmMS96nbQiFMRxNFi5S_OgBuqNWlIHYz4E7cEqXo9ooVmbFuuS5amDru3vLbHTAefzsVPigioKQkHlFh4CnCaQp6=w956-h546-n-l95-rw",
    alt: "Серебряный Родник, праздничная зона",
  },
];

export default function MapPage() {
  const [tab, setTab] = useState("map");

  const coords = [56.655922, 60.842446];
  const placeName = "Серебряный Родник";
  const address = "г. Арамиль, коттеджный поселок Березки, 39/1";
  const yandexMapUrl = "https://yandex.ru/maps/-/CPWFnYpZ";
  const photosSourceUrl = "https://ekaterinburg.arendazala.net/catalog/hall-vila-1-6904/";

  return (
    <div className="map-container">
      <h2>
        <MapPin size={28} strokeWidth={1.8} />
        <span>Место проведения</span>
      </h2>

      <section className="venue-layout" aria-label="Информация о месте проведения">
        <div className="map-info-card">
          <p className="venue-eyebrow">Свадебная площадка</p>
          <h3>{placeName}</h3>
          <p>{address}</p>
          <p className="venue-coords">
            Координаты: {coords[0]}, {coords[1]}
          </p>

          <div className="venue-actions">
            <a href={yandexMapUrl} target="_blank" rel="noopener noreferrer" className="btn">
              <Navigation size={17} strokeWidth={1.9} />
              <span>Открыть маршрут</span>
            </a>
            <a href={yandexMapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <ExternalLink size={17} strokeWidth={1.9} />
              <span>Яндекс.Карты</span>
            </a>
          </div>
        </div>

        <a href={photosSourceUrl} target="_blank" rel="noopener noreferrer" className="venue-photo-feature">
          <img src={venuePhotos[0].src} alt={venuePhotos[0].alt} />
          <span>Фото площадки</span>
        </a>
      </section>

      <section className="venue-gallery" aria-label="Фотографии площадки">
        {venuePhotos.map((photo) => (
          <a key={photo.src} href={photosSourceUrl} target="_blank" rel="noopener noreferrer" className="venue-gallery-item">
            <img src={photo.src} alt={photo.alt} loading="lazy" />
          </a>
        ))}
      </section>

      <div className="tabs">
        <button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>
          Карта
        </button>
        <button className={tab === "taxi" ? "active" : ""} onClick={() => setTab("taxi")}>
          Вызвать такси
        </button>
        <button className={tab === "parking" ? "active" : ""} onClick={() => setTab("parking")}>
          Парковка
        </button>
      </div>

      {tab === "map" && <YandexMap coords={coords} placeName={placeName} visible={tab === "map"} />}

      {tab === "taxi" && (
        <div className="taxi">
          <h3>Такси до площадки</h3>
          <p>Точка назначения уже заполнена: Серебряный Родник, Березки, 39/1.</p>
          <a
            href={`https://3.redirect.appmetrica.yandex.com/route?end-lat=${coords[0]}&end-lon=${coords[1]}&appmetrica_tracking_id=1178268795219780156`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            <CarTaxiFront size={17} strokeWidth={1.9} />
            <span>Вызвать Яндекс.Такси</span>
          </a>
        </div>
      )}

      {tab === "parking" && (
        <div className="parking">
          <h3>
            <ParkingCircle size={20} strokeWidth={1.8} />
            <span>Парковка</span>
          </h3>
          <ul>
            <li>В СНТ Березки заезжать не нужно, вместо этого используйте дорогу слева вдоль забора.</li>
            <li>Когда доедете до последнего дома, поздравляем, вы приехали на площадку!</li>
            <li>Напротив площадки есть парковка, не волнуйтесь, на нее выходят камеры.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
