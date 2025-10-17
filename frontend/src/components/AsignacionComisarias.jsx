"use client";

import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">
          🚨 Asignación de Incidentes por Comisaría
        </h1>
        <p className="text-slate-400 text-lg">
          Visualización en tiempo real de la carga operativa
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 hover:shadow-blue-900/20 transition-all duration-300">
          <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
            🗺️ Mapa de Carga Operativa
          </h2>
          <div className="bg-slate-900/50 rounded-xl p-2 border border-slate-700/30">
            <MapaComisariasIncidentes
              comisarias={comisarias}
              incidentes={incidentesRecientes}
            />
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-700/30">
              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-slate-300 font-medium">Sin carga</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-700/30">
              <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></div>
              <span className="text-slate-300 font-medium">Carga media</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-700/30">
              <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
              <span className="text-slate-300 font-medium">Alta carga</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 hover:shadow-blue-900/20 transition-all duration-300">
          <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
            📋 Incidentes Recientes
          </h2>
          {incidentesRecientes.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50">
              {incidentesRecientes.map((inc) => (
                <div
                  key={inc._id}
                  className="border-l-4 border-blue-500 bg-gradient-to-r from-slate-900/90 to-slate-800/50 rounded-xl p-5 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm border border-slate-700/30"
                >
                  <h3 className="font-bold text-blue-400 capitalize text-lg mb-2">
                    {inc.type?.replace(/_/g, " ")}
                  </h3>
                  <p className="text-slate-300 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-slate-400">
                      Barrio:
                    </span>
                    <span className="text-slate-200">{inc.barrio}</span>
                  </p>
                  {inc.comisariaAsignada ? (
                    <p className="text-blue-300 mt-3 flex items-center gap-2 bg-blue-950/30 px-3 py-2 rounded-lg border border-blue-800/30">
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></span>
                      <span className="font-semibold">Asignado a:</span>{" "}
                      <span className="text-blue-200">
                        {inc.comisariaAsignada}
                      </span>
                    </p>
                  ) : (
                    <p className="text-slate-500 mt-3 italic flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
                      Asignando...
                    </p>
                  )}
                  {inc.description && (
                    <p className="text-slate-400 mt-3 text-sm italic bg-slate-900/40 p-3 rounded-lg border border-slate-700/20">
                      "{inc.description}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">📭</div>
              <p className="text-slate-500 text-lg">
                No hay incidentes recientes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
