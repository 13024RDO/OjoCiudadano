import React, { useState, useEffect } from "react";
import MapaComisariasIncidentes from "../components/MapaComisariasIncidentes";

export default function AsignacionComisarias() {
  const [incidentesRecientes, setIncidentesRecientes] = useState([]);
  const [comisarias, setComisarias] = useState([]);

  // Cargar datos desde el backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Endpoint de incidentes (con ?admin=true)
        const incRes = await fetch(
          "http://localhost:3000/api/incidents?admin=true"
        );
        if (!incRes.ok) {
          console.error(
            "❌ Error al cargar incidentes:",
            incRes.status,
            incRes.statusText
          );
          return;
        }
        const incidentes = await incRes.json();

        // Endpoint de comisarías
        const comiRes = await fetch(
          "http://localhost:3000/api/operaciones/comisarias"
        );
        if (!comiRes.ok) {
          console.error(
            "❌ Error al cargar comisarías:",
            comiRes.status,
            comiRes.statusText
          );
          return;
        }
        const comisariasData = await comiRes.json();

        // Actualizar estado
        setIncidentesRecientes(incidentes);
        setComisarias(comisariasData);

        console.log("✅ Incidentes cargados:", incidentes);
        console.log("✅ Comisarías cargadas:", comisariasData);
      } catch (err) {
        console.error("🔥 Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          🚨 Asignación de Incidentes por Comisaría
        </h1>
        <p className="text-gray-600">
          Visualización en tiempo real de la carga operativa
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa con círculos */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🗺️ Mapa de Carga Operativa
          </h2>
          <MapaComisariasIncidentes
            comisarias={comisarias}
            incidentes={incidentesRecientes}
          />
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Sin carga</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span>Carga media</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Alta carga</span>
            </div>
          </div>
        </div>

        {/* Lista de incidentes */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Incidentes Recientes
          </h2>
          {incidentesRecientes.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {incidentesRecientes.map((inc) => (
                <div
                  key={inc._id}
                  className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-blue-800 capitalize">
                    {inc.type?.replace(/_/g, " ")}
                  </h3>
                  <p className="text-gray-700 mt-1">
                    <span className="font-semibold">Barrio:</span> {inc.barrio}
                  </p>
                  {inc.comisariaAsignada ? (
                    <p className="text-blue-700 mt-2 flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="font-semibold">Asignado a:</span>{" "}
                      {inc.comisariaAsignada}
                    </p>
                  ) : (
                    <p className="text-gray-500 mt-2 italic">Asignando...</p>
                  )}
                  {inc.description && (
                    <p className="text-gray-600 mt-2 text-sm">
                      "{inc.description}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay incidentes recientes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
