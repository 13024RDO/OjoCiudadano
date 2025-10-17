import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function DashboardSeguridad() {
  const [datos, setDatos] = useState([]);
  const [stats, setStats] = useState({
    total_last_24h: 0,
    top_barrio: null,
    incidents_by_type: [],
    incidents_by_barrio: [],
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Asegúrate de que esta URL coincida con tu backend
        const respuesta = await fetch("http://localhost:5000/api/stats/summary");
        if (!respuesta.ok) throw new Error("Error en la respuesta");
        const data = await respuesta.json();

        // Transformar datos para el gráfico de torta
        const datosTransformados = data.incidents_by_type.map((item) => ({
          categoria: item._id || "Sin tipo",
          cantidad: item.count,
        }));

        setDatos(datosTransformados);
        setStats({
          total_last_24h: data.total_last_24h || 0,
          top_barrio: data.top_barrio || "Ninguno",
          incidents_by_type: data.incidents_by_type || [],
          incidents_by_barrio: data.incidents_by_barrio || [],
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  // Paleta de colores
  const colores = ["#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA"];

  const cardStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 0 6px rgba(0,0,0,0.2)",
    flex: "1",
    minWidth: "200px",
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          Panel de Seguridad Ciudadana
        </h1>
        <div
          style={{
            fontSize: "0.85rem",
            color: "#bbbbbb",
          }}
        >
          Últimas 24 horas
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: "0.85rem", color: "#bbbbbb", marginBottom: "8px" }}>
            Total de Incidentes (24h)
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffff" }}>
            {stats.total_last_24h}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "0.85rem", color: "#bbbbbb", marginBottom: "8px" }}>
            Barrio con Más Incidentes
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FBBF24" }}>
            {stats.top_barrio}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "0.85rem", color: "#bbbbbb", marginBottom: "8px" }}>
            Tipos de Incidentes
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#60A5FA" }}>
            {stats.incidents_by_type.length}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "0.85rem", color: "#bbbbbb", marginBottom: "8px" }}>
            Barrios Reportados
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34D399" }}>
            {stats.incidents_by_barrio.length}
          </div>
        </div>
      </div>

      {/* Gráfico de Torta: Incidentes por Tipo */}
      <div
        style={{
          ...cardStyle,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "12px" }}>
            Distribución por Tipo de Incidente (Últimas 24h)
          </h3>
          {datos.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={datos}
                dataKey="cantidad"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {datos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colores[index % colores.length]}
                    stroke="#000"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p style={{ color: "#888" }}>No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Lista de Barrios (Top 5) */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "12px" }}>
          Top Barrios con Más Incidentes (24h)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stats.incidents_by_barrio.slice(0, 5).map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #333",
              }}
            >
              <span>{item._id || "Desconocido"}</span>
              <span style={{ color: "#FBBF24", fontWeight: "bold" }}>{item.count}</span>
            </div>
          ))}
          {stats.incidents_by_barrio.length === 0 && (
            <p style={{ color: "#888", textAlign: "center" }}>Sin datos de barrios</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#666666",
          paddingTop: "20px",
          borderTop: "1px solid #333333",
          marginTop: "20px",
        }}
      >
        Plataforma de Seguridad Ciudadana – Datos actualizados en tiempo real
      </div>
    </div>
  );
}

export default DashboardSeguridad;