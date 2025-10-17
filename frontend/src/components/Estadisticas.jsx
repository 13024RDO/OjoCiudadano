import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function DashboardSeguridad() {
  const [datos, setDatos] = useState([]);
  const [stats, setStats] = useState({
    total_incidents: 0,
    last_24h: 0,
    last_week: 0,
    last_month: 0,
    incidents_by_type: [],
    severity_levels: [],
    daily_avg: 0,
    weekly_avg: 0,
    monthly_avg: 0,
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:3000/api/stats/summary"
        );
        const data = await respuesta.json();

        const datosTransformados = data.incidents_by_type.map((item) => ({
          categoria: item._id,
          cantidad: item.count,
        }));

        setDatos(datosTransformados);

        // Guardar stats completos
        setStats({
          total_incidents: data.total_incidents || 0,
          last_24h: data.last_24h || 0,
          last_week: data.last_week || 0,
          last_month: data.last_month || 0,
          incidents_by_type: data.incidents_by_type || [],
          severity_levels: data.severity_levels || [],
          daily_avg: data.daily_avg || 0,
          weekly_avg: data.weekly_avg || 0,
          monthly_avg: data.monthly_avg || 0,
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  // Paleta de colores para el gráfico de torta (neón sutil)
  const colores = [
    "#60A5FA", // Azul cielo
    "#F87171", // Rojo suave
    "#34D399", // Verde menta
    "#FBBF24", // Amarillo dorado
    "#A78BFA", // Morado
  ];

  // Mapeo de severidad a colores
  const getSeverityColor = (level) => {
    switch (level) {
      case "Baja":
        return "#34D399";
      case "Media":
        return "#FBBF24";
      case "Alta":
        return "#F59E0B";
      case "Crítica":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  // Estilo para las tarjetas de resumen
  const cardStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 0 6px rgba(0,0,0,0.2)",
    flex: "1",
    minWidth: "200px",
  };

  // Estilo para barras horizontales
  const barStyle = (widthPercent, color) => ({
    height: "12px",
    backgroundColor: color,
    borderRadius: "6px",
    width: `${widthPercent}%`,
    transition: "width 0.5s ease",
  });

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
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Panel de Análisis de Incidentes
        </h1>
        <div
          style={{
            display: "flex",
            gap: "10px",
            fontSize: "0.85rem",
            color: "#bbbbbb",
          }}
        >
          <span>Actualizado: Hace 5 min</span>
        </div>
      </div>

      {/* Tarjetas de Resumen Superior */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Total de Incidentes */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
              Total de Incidentes
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ff4444"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 17h.01M12 12h.01M12 12v.01M12 12h.01V12z"
              />
            </svg>
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffff" }}
          >
            {stats.total_incidents}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888888" }}>
            Reportes acumulados
          </div>
        </div>

        {/* Últimas 24 Horas */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
              Últimas 24 Horas
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4caf50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffff" }}
          >
            {stats.last_24h}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888888" }}>
            100% del total
          </div>
        </div>

        {/* Última Semana */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
              Última Semana
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ffcc00"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8 8 8"
              />
            </svg>
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffff" }}
          >
            {stats.last_week}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888888" }}>
            100% del total
          </div>
        </div>

        {/* Último Mes */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
              Último Mes
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4caf50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffff" }}
          >
            {stats.last_month}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888888" }}>
            100% del total
          </div>
        </div>
      </div>

      {/* Sección de Gráficos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Incidentes por Tipo */}
        <div
          style={{
            ...cardStyle,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Incidentes por Tipo
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#aaaaaa",
              marginBottom: "12px",
            }}
          >
            Distribución de reportes según categoría
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {stats.incidents_by_type.map((item, index) => {
              const total = stats.total_incidents;
              const percent =
                total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "0.85rem", minWidth: "120px" }}>
                    {item._id}
                  </span>
                  <div
                    style={barStyle(percent, colores[index % colores.length])}
                  ></div>
                  <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
                    {item.count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nivel de Gravedad */}
        <div
          style={{
            ...cardStyle,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Nivel de Gravedad
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#aaaaaa",
              marginBottom: "12px",
            }}
          >
            Clasificación de incidentes por severidad
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {stats.severity_levels.map((item, index) => {
              const total = stats.total_incidents;
              const percent =
                total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: getSeverityColor(item._id),
                      marginRight: "8px",
                    }}
                  ></div>
                  <span style={{ fontSize: "0.85rem", minWidth: "80px" }}>
                    {item._id}
                  </span>
                  <div
                    style={barStyle(percent, getSeverityColor(item._id))}
                  ></div>
                  <span style={{ fontSize: "0.85rem", color: "#bbbbbb" }}>
                    {item.count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Análisis de Tendencias */}
      <div
        style={{
          ...cardStyle,
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "8px" }}
        >
          Análisis de Tendencias
        </h3>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#aaaaaa",
            marginBottom: "16px",
          }}
        >
          Resumen de actividad reciente
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              8
            </div>
            <div style={{ fontSize: "0.75rem", color: "#bbbbbb" }}>
              Actividad Diaria
            </div>
            <div style={{ fontSize: "0.75rem", color: "#888888" }}>
              8 reportes en las últimas 24h
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {stats.weekly_avg.toFixed(1)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#bbbbbb" }}>
              Promedio Semanal
            </div>
            <div style={{ fontSize: "0.75rem", color: "#888888" }}>
              Reportes por día (últimos 7 días)
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {stats.monthly_avg.toFixed(1)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#bbbbbb" }}>
              Promedio Mensual
            </div>
            <div style={{ fontSize: "0.75rem", color: "#888888" }}>
              Reportes por día (últimos 30 días)
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Torta - Mantenido tal cual, solo estilizado */}
      <div
        style={{
          ...cardStyle,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Distribución de Incidentes
          </h3>
          <PieChart width={400} height={400}>
            <Pie
              data={datos}
              dataKey="cantidad"
              nameKey="categoria"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {datos.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colores[index % colores.length]}
                  stroke="#000"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
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
        Plataforma de Seguridad Ciudadana - Empoderando a la comunidad con
        información en tiempo real
      </div>
    </div>
  );
}

export default DashboardSeguridad;
