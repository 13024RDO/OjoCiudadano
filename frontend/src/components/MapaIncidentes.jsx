// src/components/MapaIncidentes.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono personalizado para incidentes (rojo)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconIncidente = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaIncidentes({ incidentes }) {
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
    <div className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Solo marcadores de incidentes */}
        {incidentes.map((inc) => (
          <Marker
            key={inc._id}
            position={[
              inc.location.coordinates[1],
              inc.location.coordinates[0],
            ]}
            icon={iconIncidente}
          >
            <Popup>
              <b>{TIPOS_LABEL[inc.type] || inc.type}</b>
              <br />
              Barrio: {inc.barrio}
              <br />
              {inc.comisariaAsignada && <>👮 {inc.comisariaAsignada}</>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

const TIPOS_LABEL = {
  robo_moto: "Robo de moto",
  robo_bici: "Robo de bici",
  robo_vehiculo: "Robo de vehículo",
  abandono_vehiculo: "Vehículo abandonado",
  daño_luminaria: "Daño en iluminación",
  basura_acumulada: "Basura acumulada",
  sospechoso: "Situación sospechosa",
  riña: "Pelea",
  ruido_molestia: "Ruido molesto",
  otros: "Otros",
};
