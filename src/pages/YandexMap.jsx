import { useEffect, useRef } from "react";

export default function YandexMap({ coords, placeName, visible }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (visible && window.ymaps && containerRef.current && !mapRef.current) {
      window.ymaps.ready(() => {
        mapRef.current = new window.ymaps.Map(containerRef.current, {
          center: coords,
          zoom: 15,
        });

        const placemark = new window.ymaps.Placemark(coords, {
          balloonContent: placeName,
        });

        mapRef.current.geoObjects.add(placemark);
      });
    }

    return () => {
      // при размонтировании очищаем карту, если была
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [visible, coords, placeName]);

  return (
    <div
      ref={containerRef}
      style={{
        display: visible ? "block" : "none",
        width: "100%",
        height: "300px",
        borderRadius: "15px",
        marginTop: "15px",
      }}
    />
  );
}