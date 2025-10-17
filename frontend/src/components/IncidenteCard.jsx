// src/components/IncidenteCard.js
import React from "react";

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

export default function IncidenteCard({ incidente }) {
  const tipoLabel = TIPOS_LABEL[incidente.type] || incidente.type;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-red-700 mb-1">{tipoLabel}</h3>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">📍 Barrio:</span> {incidente.barrio}
      </p>
      {incidente.comisariaAsignada && (
        <p className="text-sm text-blue-700">
          <span className="font-semibold">👮 Comisaría asignada:</span>{" "}
          {incidente.comisariaAsignada}
        </p>
      )}
      {incidente.photoUrl && (
        <img
          src={incidente.photoUrl}
          alt="Foto del incidente"
          className="mt-2 w-full h-24 object-cover rounded-md"
        />
      )}
    </div>
  );
}
