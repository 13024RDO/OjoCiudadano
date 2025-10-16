import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect, useState } from "react";

export default function MapaIncidentes() {
  const [barrios, setBarrios] = useState([]);

  // 🔹 Obtener datos del backend
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats/summary");
        const data = await res.json();
        setBarrios(data.incidents_by_barrio || []);
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
      }
    };

    fetchDatos();
  }, []);

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-xl">
      <MapContainer
        center={[-26.177, -58.178]} // Centro de Formosa
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Ahora el componente con useMap() va adentro */}
        <CapaCalor datos={barrios} />
      </MapContainer>
    </div>
  );
}

// 🔹 Este componente sí puede usar useMap()
const CapaCalor = ({ datos }) => {
  const map = useMap();

  useEffect(() => {
    if (!datos || datos.length === 0) return;

    const coordenadasBarrios = {
      "San Miguel": [-26.177, -58.178],
      "17 de Octubre": [-26.18825, -58.19990],
      "Eva Perón": [-26.13448, -58.15816],
      "Villa del Carmen": [-26.180, -58.220],
    };

    const puntos = datos
      .map((barrio) => {
        const coords = coordenadasBarrios[barrio._id];
        if (!coords) return null;
        return [coords[0], coords[1], barrio.count];
      })
      .filter(Boolean);

    const heat = window.L.heatLayer(puntos, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [datos, map]);

  return null; // 👈 No renderiza nada visual
};
