import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 Íconos personalizados para evitar el error de ícono faltante
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícono para comisarías (azul)
const iconComisaria = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

// Ícono para móviles (verde)
const iconMovil = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

export default function MapaOperaciones({ incidentes, comisarias, moviles }) {
  // Calcular centro del mapa
  const [center, setCenter] = useState([-26.185, -58.173]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (incidentes.length > 0) {
      const primerInc = incidentes[0];
      setCenter([
        primerInc.location.coordinates[1],
        primerInc.location.coordinates[0],
      ]);
      setZoom(15);
    }
  }, [incidentes]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%", borderRadius: "8px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de incidentes */}
      {incidentes.map((inc) => (
        <Marker
          key={inc._id}
          position={[inc.location.coordinates[1], inc.location.coordinates[0]]}
          icon={L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Popup>
            <b>{inc.type}</b>
            <br />
            Barrio: {inc.barrio}
            <br />
            {inc.comisariaAsignada && <>👮 {inc.comisariaAsignada}</>}
            {inc.movilAsignado && (
              <>
                <br />
                🚗 {inc.movilAsignado.patente} - {inc.movilAsignado.estado}
              </>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Marcadores de comisarías */}
      {comisarias.map((comi) => (
        <Marker
          key={comi._id}
          position={[
            comi.location.coordinates[1],
            comi.location.coordinates[0],
          ]}
          icon={iconComisaria}
        >
          <Popup>
            <b>{comi.nombre}</b>
            <br />
            {comi.direccion}
            <br />
            📞 {comi.telefono}
          </Popup>
        </Marker>
      ))}

      {/* Marcadores de móviles */}
      {moviles.map((movil) => (
        <Marker
          key={movil._id}
          position={[
            movil.ubicacionActual.coordinates[1],
            movil.ubicacionActual.coordinates[0],
          ]}
          icon={iconMovil}
        >
          <Popup>
            <b>Móvil {movil.patente}</b>
            <br />
            Estado:{" "}
            <span
              style={{
                color: movil.estado === "disponible" ? "green" : "orange",
              }}
            >
              {movil.estado}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
