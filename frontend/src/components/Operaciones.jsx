import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono personalizado para evitar errores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícono por prioridad
const getIconByPriority = (priority) => {
  const icons = {
    Urgente:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    Medio:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    Bajo: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    Analizando:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gray.png",
  };
  return new L.Icon({
    iconUrl: icons[priority] || icons.Analizando,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

// Función para traducir prioridad
const getPriorityInfo = (priority) => {
  const p = String(priority);
  if (p === "3" || p === "Urgente")
    return { text: "Urgente", class: "Urgente" };
  if (p === "2" || p === "Medio") return { text: "Medio", class: "Medio" };
  if (p === "1" || p === "Bajo") return { text: "Bajo", class: "Bajo" };
  return { text: "Analizando...", class: "Analizando" };
};

export default function MapaYAlertas() {
  const [incidents, setIncidents] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");
  const wsRef = useRef(null);

  // Conectar WebSocket
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket("ws://localhost:3000");
      wsRef.current = ws;

      ws.onopen = () => setConnectionStatus("Conectado");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_incident") {
          setIncidents((prev) => ({
            ...prev,
            [data.payload.id]: data.payload,
          }));
        }
        if (data.type === "incident_priority_updated") {
          const { id, priority } = data.payload;
          setIncidents((prev) => ({
            ...prev,
            [id]: { ...prev[id], priority },
          }));
        }
        if (data.type === "incident_status_updated") {
          const { id, status } = data.payload;
          setIncidents((prev) => ({
            ...prev,
            [id]: { ...prev[id], status },
          }));
        }
      };
      ws.onclose = () => {
        setConnectionStatus("Desconectado");
        setTimeout(connect, 3000);
      };
    };

    connect();
    return () => wsRef.current?.close();
  }, []);

  // Enviar actualización de estado
  const updateIncidentStatus = (id, status) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "update_status",
          payload: { id, status },
        })
      );
    }
  };

  // Calcular estadísticas
  const incidentsArray = Object.values(incidents);
  const stats = {
    total: incidentsArray.length,
    urgent: incidentsArray.filter(
      (i) => getPriorityInfo(i.priority).text === "Urgente"
    ).length,
    medio: incidentsArray.filter(
      (i) => getPriorityInfo(i.priority).text === "Medio"
    ).length,
    bajo: incidentsArray.filter(
      (i) => getPriorityInfo(i.priority).text === "Bajo"
    ).length,
  };

  // Ordenar incidentes
  const sortedIncidents = [...incidentsArray].sort((a, b) => {
    const order = { Urgente: 1, Medio: 2, Bajo: 3, "Analizando...": 4 };
    const prioA = order[getPriorityInfo(a.priority).text] || 99;
    const prioB = order[getPriorityInfo(b.priority).text] || 99;
    return prioA - prioB || new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4">
      <div className="max-w-7xl ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">
              Centro de Control de Alertas
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "Conectado"
                    ? "bg-green-500"
                    : "bg-red-500"
                } animate-pulse`}
              />
              <span className="text-sm text-slate-300">{connectionStatus}</span>
            </div>
          </div>
          <p className="text-slate-400">
            Monitoreo en tiempo real de incidentes del sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Alertas"
            value={stats.total}
            color="blue"
            icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
          <StatCard
            title="Urgentes"
            value={stats.urgent}
            color="red"
            icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
          <StatCard
            title="Medios"
            value={stats.medio}
            color="amber"
            icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <StatCard
            title="Bajos"
            value={stats.bajo}
            color="green"
            icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </div>

        {/* Mapa y Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mapa */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
            <h2 className="text-xl font-semibold mb-4">Mapa de Incidentes</h2>
            <div className="rounded-lg overflow-hidden h-[500px] border border-slate-700/30">
              <MapContainer
                center={[-26.185, -58.173]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sortedIncidents.map((incident) => (
                  <Marker
                    key={incident.id}
                    position={[
                      incident.location.coordinates[1],
                      incident.location.coordinates[0],
                    ]}
                    icon={getIconByPriority(
                      getPriorityInfo(incident.priority).text
                    )}
                  >
                    <Popup>
                      <b>{incident.type.replace(/_/g, " ")}</b>
                      <br />
                      {incident.description || "Sin descripción"}
                      <br />
                      Barrio: {incident.barrio}
                      <br />
                      Prioridad: {getPriorityInfo(incident.priority).text}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Lista de alertas */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Alertas Recientes</h2>
            {sortedIncidents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>No hay alertas activas</p>
                <p className="text-sm mt-2">Esperando nuevos incidentes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedIncidents.map((incident) => {
                  const priorityInfo = getPriorityInfo(incident.priority);
                  const solved = incident.status === "solucionado";
                  return (
                    <div
                      key={incident.id}
                      className={`rounded-lg p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 transition-all hover:shadow-lg ${
                        solved ? "opacity-60" : ""
                      } border-l-4 ${
                        priorityInfo.class === "Urgente"
                          ? "border-red-500"
                          : priorityInfo.class === "Medio"
                          ? "border-amber-500"
                          : priorityInfo.class === "Bajo"
                          ? "border-green-500"
                          : "border-gray-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                              priorityInfo.class === "Urgente"
                                ? "bg-red-900/30 text-red-400 border border-red-900/50"
                                : priorityInfo.class === "Medio"
                                ? "bg-amber-900/30 text-amber-400 border border-amber-900/50"
                                : priorityInfo.class === "Bajo"
                                ? "bg-green-900/30 text-green-400 border border-green-900/50"
                                : "bg-gray-900/30 text-gray-400 border border-gray-900/50"
                            }`}
                          >
                            {priorityInfo.text}
                          </span>
                          <h3 className="text-xl font-semibold text-white capitalize mt-2 mb-2">
                            {incident.type.replace(/_/g, " ")}
                          </h3>
                          <p className="text-slate-300">
                            {incident.description || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(incident.timestamp).toLocaleString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Barrio: {incident.barrio}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                        <button
                          className={`px-3 py-1.5 rounded text-sm font-medium ${
                            incident.status === "pendiente"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                          onClick={() =>
                            updateIncidentStatus(incident.id, "pendiente")
                          }
                        >
                          Pendiente
                        </button>
                        <button
                          className={`px-3 py-1.5 rounded text-sm font-medium ${
                            incident.status === "solucionado"
                              ? "bg-green-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                          onClick={() =>
                            updateIncidentStatus(incident.id, "solucionado")
                          }
                        >
                          Solucionado
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para estadísticas
function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: "text-blue-400",
    red: "text-red-400",
    amber: "text-amber-400",
    green: "text-green-400",
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/70 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <svg
          className={`w-5 h-5 ${colorClasses[color]}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={icon}
          />
        </svg>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
