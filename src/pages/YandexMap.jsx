import { useEffect } from "react";

export default function YandexMap({ coords, placeName }) {
  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(init);
    }

    function init() {
      const map = new window.ymaps.Map("map", {
        center: coords,
        zoom: 15,
      });

      const placemark = new window.ymaps.Placemark(coords, {
        balloonContent: placeName,
      });

      map.geoObjects.add(placemark);
    }
  }, [coords, placeName]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "15px",
        marginTop: "15px",
      }}
    />
  );
}