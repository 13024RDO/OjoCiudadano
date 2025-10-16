// src/pages/OperacionesPage.js
import React, { useState, useEffect } from "react";
import ComisariaCard from "../components/ComisariaCard";
import IncidenteCard from "../components/IncidenteCard";
import MapaOperaciones from "../components/MapaOperaciones";
import { connectWebSocket, closeWebSocket } from "../utils/websocket";

export default function OperacionesPage() {
  const [comisariasConMoviles, setComisariasConMoviles] = useState([]);
  const [incidentesRecientes, setIncidentesRecientes] = useState([]);

  // Extraer listas planas para el mapa
  const comisariasPlanas = comisariasConMoviles.map((c) => c);
  const movilesPlanos = comisariasConMoviles.flatMap((c) => c.moviles || []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [comisariasRes, incRes] = await Promise.all([
          fetch("http://localhost:5000/api/operaciones/comisarias-con-moviles"),
          fetch("http://localhost:5000/api/incidents?admin=true"),
        ]);
        const comisariasData = await comisariasRes.json();
        const incidentesData = await incRes.json();
        setComisariasConMoviles(comisariasData);
        setIncidentesRecientes(incidentesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const manejarMensaje = (msg) => {
      if (msg.type === "new_incident") {
        setIncidentesRecientes((prev) => [msg.payload, ...prev.slice(0, 19)]);
      }
      if (msg.type === "moviles_update") {
        fetch("http://localhost:5000/api/operaciones/comisarias-con-moviles")
          .then((res) => res.json())
          .then((data) => setComisariasConMoviles(data));
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

      {/* Mapa */}
      <section className="mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🗺️ Mapa de Operaciones
          </h2>
          <MapaOperaciones
            incidentes={incidentesRecientes}
            comisarias={comisariasPlanas}
            moviles={movilesPlanos}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de comisarías */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🏢 Comisarías y Patrullas
            </h2>
            {comisariasConMoviles.length > 0 ? (
              comisariasConMoviles.map((comi) => (
                <ComisariaCard
                  key={comi._id}
                  comi={comi}
                  moviles={comi.moviles || []}
                />
              ))
            ) : (
              <p className="text-gray-500">Cargando...</p>
            )}
          </div>
        </div>

        {/* Panel de incidentes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚨 Incidentes Recientes
            </h2>
            {incidentesRecientes.length > 0 ? (
              incidentesRecientes.map((inc) => (
                <IncidenteCard key={inc.id || inc._id} incidente={inc} />
              ))
            ) : (
              <p className="text-gray-500">No hay incidentes recientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
