import React, { useState, useEffect } from "react";
import { LuNotebookText } from "react-icons/lu";
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
    <div className="bg[#060314] w-full text-white font-[Poppins] min-h-screen p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold ">
           Asignación de Incidentes por Comisaría
        </h1>
        <p className="text-gray-400">
          Visualización en tiempo real de la carga operativa
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa con círculos */}
        <div className="border-2 border-gray-400  rounded-lg shadow-md transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
          <div className="h-[500px]">
            <MapaComisariasIncidentes
            comisarias={comisarias}
            incidentes={incidentesRecientes}
          />
          </div>
          <div className="p-4 pt-2 flex items-center justify-center gap-4 text-sm text-gray-600">
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
          <div className="border-2 border-gray-400 rounded-lg overflow-auto scrollbar-hide h-[550px] shadow-md transform hover:scale-[1.01] transition-all duration-300 p-4 flex flex-col">
            <h2 className="text-xl text-white flex font-semibold gap-2 mb-4">
              <LuNotebookText className="text-[30px]" />
               Incidentes Recientes
            </h2>
         {incidentesRecientes.length > 0 ? (
            <div className="space-y-4 max-h-[500px]  pr-2 flex-1">
              {incidentesRecientes.map((inc) => (
                <div
                  key={inc._id}
                  className="border-2 border-gray-300 bg-[#0a0720] rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-2xl text-[#bdb8e3] capitalize">
                    {inc.type?.replace(/_/g, " ") || "Sin tipo"}
                  </h3>
                  <p className=" mt-1">
                    <span className="font-semibold text-gray-400">Barrio:</span>{" "}
                    {inc.barrio || "Desconocido"}
                  </p>
                  {inc.comisariaAsignada ? (
                    <p className="text-blue-400 mt-2 flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="font-semibold">Asignado a:</span>
                      {inc.comisariaAsignada}
                    </p>
                  ) : (
                    <p className="text-gray-500 mt-2 italic">Asignando...</p>
                  )}
                  {inc.description && (
                    <p className="text-gray-400 mt-2 text-sm">
                      <span className="font-semibold">Descripcion: </span>
                      {inc.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 flex-1 flex items-center justify-center">
              No hay incidentes recientes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
