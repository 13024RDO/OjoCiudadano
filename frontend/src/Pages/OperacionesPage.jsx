import React, { useState, useEffect } from "react";
import MovilCard from "../components/MovilCard";
import IncidenteCard from "../components/IncidenteCard";
import { connectWebSocket, closeWebSocket } from "../utils/websocket";

export default function OperacionesPage() {
  const [moviles, setMoviles] = useState([]);
  const [incidentesRecientes, setIncidentesRecientes] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [movRes, incRes] = await Promise.all([
          fetch("http://localhost:5000/api/operaciones/moviles"),
          fetch("http://localhost:5000/api/incidents?admin=true"),
        ]);
        const movilesData = await movRes.json();
        const incidentesData = await incRes.json();
        setMoviles(movilesData);
        setIncidentesRecientes(incidentesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    cargarDatos();
  }, []);

  // Conectar WebSocket
  useEffect(() => {
    const manejarMensaje = (msg) => {
      if (msg.type === "new_incident") {
        setIncidentesRecientes((prev) => [msg.payload, ...prev.slice(0, 19)]);
      }
      if (msg.type === "moviles_update") {
        setMoviles(msg.payload);
      }
    };

    connectWebSocket(manejarMensaje);
    return () => closeWebSocket();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Centro de Operaciones - Policía de Formosa</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Panel de móviles */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2>Estado de Patrullas</h2>
          {moviles.length > 0 ? (
            moviles.map((movil) => <MovilCard key={movil.id} movil={movil} />)
          ) : (
            <p>Cargando...</p>
          )}
        </div>

        {/* Panel de incidentes */}
        <div
          style={{
            flex: 2,
            backgroundColor: "#fff0f0",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2>Incidentes Recientes</h2>
          {incidentesRecientes.length > 0 ? (
            incidentesRecientes.map((inc) => (
              <IncidenteCard key={inc.id || inc._id} incidente={inc} />
            ))
          ) : (
            <p>Sin incidentes recientes</p>
          )}
        </div>
      </div>
    </div>
  );
}
