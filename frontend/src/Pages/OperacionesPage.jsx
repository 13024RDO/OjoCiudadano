// src/pages/OperacionesPage.js
import React, { useState, useEffect } from "react";
import IncidenteCard from "../components/IncidenteCard";
import MapaIncidentes from "../components/MapaIncidentes";
import { connectWebSocket, closeWebSocket } from "../utils/websocket";

export default function OperacionesPage() {
  const [incidentesRecientes, setIncidentesRecientes] = useState([]);

  useEffect(() => {
    const cargarIncidentes = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/incidents?admin=true"
        );
        const data = await res.json();
        setIncidentesRecientes(data);
      } catch (err) {
        console.error("Error al cargar incidentes:", err);
      }
    };
    cargarIncidentes();
  }, []);

  useEffect(() => {
    const manejarMensaje = (msg) => {
      if (msg.type === "new_incident") {
        setIncidentesRecientes((prev) => [msg.payload, ...prev.slice(0, 19)]);
      }
    };

    connectWebSocket(manejarMensaje);
    return () => closeWebSocket();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          🚨 Centro de Operaciones - Policía de Formosa
        </h1>
      </header>

      {/* Mapa de incidentes */}
      <section className="mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🗺️ Mapa de Incidentes
          </h2>
          <MapaIncidentes incidentes={incidentesRecientes} />
        </div>
      </section>

      {/* Lista de incidentes */}
      <section>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Incidentes Recientes
          </h2>
          {incidentesRecientes.length > 0 ? (
            incidentesRecientes.map((inc) => (
              <IncidenteCard key={inc.id || inc._id} incidente={inc} />
            ))
          ) : (
            <p className="text-gray-500">No hay incidentes recientes</p>
          )}
        </div>
      </section>
    </div>
  );
}
