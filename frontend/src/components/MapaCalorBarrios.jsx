import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono personalizado con tamaño variable
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaCalorBarrios({ datosCalor }) {
  // Coordenadas centrales de los barrios (ajustá según tus datos reales)
  const barriosCentros = {
    Liborsi: [-26.185, -58.173],
    "San Miguel": [-26.1845, -58.1785],
    "Barrio Obrero": [-26.179, -58.172],
    "17 de Octubre": [-26.19, -58.185],
    "Lomas del Sur": [-26.204, -58.194],
    "Villa del Carmen": [-26.172, -58.165],
  };

  const getColor = (count) => {
    if (count === 0) return "#b2df8a"; // Verde claro
    if (count <= 2) return "#33a02c"; // Verde
    if (count <= 5) return "#fdbf6f"; // Naranja
    return "#e31a1c"; // Rojo
  };

  const getSize = (count) => {
    if (count === 0) return 10;
    if (count <= 2) return 20;
    if (count <= 5) return 30;
    return 40;
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[-26.185, -58.173]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores por barrio */}
        {Object.keys(barriosCentros).map((barrio) => {
          const count = (datosCalor && datosCalor[barrio]) || 0;
          const [lat, lng] = barriosCentros[barrio];
          const size = getSize(count);
          const color = getColor(count);

          const icon = L.divIcon({
            html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: ${
              size > 20 ? "12px" : "10px"
            };">${count}</div>`,
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          return (
            <Marker key={barrio} position={[lat, lng]} icon={icon}>
              <Popup>
                <b>{barrio}</b>
                <br />
                Incidentes: {count}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
