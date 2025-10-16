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
  return (
    <div
      style={{
        borderLeft: "4px solid #d32f2f",
        padding: "12px",
        marginBottom: "12px",
        backgroundColor: "#fff8f8",
      }}
    >
      <h4>{TIPOS_LABEL[incidente.type] || incidente.type}</h4>
      <p>📍 Barrio: {incidente.barrio}</p>
      <p>🕒 {new Date(incidente.timestamp).toLocaleTimeString()}</p>

      {incidente.comisariaAsignada && (
        <p>👮 Comisaría: {incidente.comisariaAsignada}</p>
      )}

      {incidente.movilAsignado && (
        <p>
          🚗 Móvil {incidente.movilAsignado.patente} -
          {incidente.movilAsignado.estado}
        </p>
      )}
    </div>
  );
}
