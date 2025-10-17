// src/components/MapaComisariasIncidentes.jsx
import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono para evitar errores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaComisariasIncidentes({ comisarias, incidentes }) {
  // Contar incidentes por comisaría
  const incidentesPorComisaria = incidentes.reduce((acc, inc) => {
    const nombre = inc.comisariaAsignada;
    if (nombre) {
      acc[nombre] = (acc[nombre] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-[500px]">
      <MapContainer
        center={[-26.185, -58.173]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Círculos sobre comisarías */}
        {comisarias.map((comi) => {
          const count = incidentesPorComisaria[comi.nombre] || 0;
          const radius = Math.max(200, count * 100); // Radio en metros
          const color =
            count === 0 ? "#10b981" : count <= 2 ? "#f59e0b" : "#ef4444";

          return (
            <Circle
              key={comi._id}
              center={[
                comi.location.coordinates[1],
                comi.location.coordinates[0],
              ]}
              radius={radius}
              color={color}
              fillColor={color}
              fillOpacity={0.2}
              weight={2}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-blue-700">{comi.nombre}</h3>
                  <p className="mt-1">
                    <span className="font-semibold">Incidentes asignados:</span>{" "}
                    {count}
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
