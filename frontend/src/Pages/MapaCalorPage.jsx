// src/pages/MapaCalorPage.js
import React, { useState, useEffect } from "react";
import MapaCalorBarrios from "../components/MapaCalorBarrios";
import { connectWebSocket, closeWebSocket } from "../utils/websocket";

export default function MapaCalorPage() {
  const [datosCalor, setDatosCalor] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/stats/barrios-calor"
        );
        const data = await res.json();
        setDatosCalor(data);
      } catch (err) {
        console.error("Error al cargar datos de calor:", err);
      }
    };
    cargarDatos();
  }, []);

  // WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    const manejarMensaje = (msg) => {
      if (msg.type === "barrios_calor_update") {
        setDatosCalor(msg.payload);
      }
    };

    connectWebSocket(manejarMensaje);
    return () => closeWebSocket();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          🔥 Mapa de Calor - Incidentes por Barrio
        </h1>
        <p className="text-gray-600">
          Últimas 24 horas - Actualización en tiempo real
        </p>
      </header>

      <MapaCalorBarrios datosCalor={datosCalor} />
    </div>
  );
}
