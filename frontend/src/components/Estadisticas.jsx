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
        const respuesta = await fetch(
          "http://localhost:3000/api/stats/summary"
        );
        if (!respuesta.ok) throw new Error("Error en la respuesta");
        const data = await respuesta.json();

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

  const colores = ["#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA"];

  return (
    <div className="bg-gray-900 text-white w-full  p-5 font-[Poppins] box-border">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Panel de Seguridad Ciudadana</h1>
        <div className="text-sm text-gray-400">Últimas 24 horas</div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-5">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-md flex-1 min-w-[200px]">
          <div className="text-sm text-gray-400 mb-2">Total de Incidentes</div>
          <div className="text-4xl font-bold text-white">
            {stats.total_last_24h}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-md flex-1 min-w-[200px]">
          <div className="text-sm text-gray-400 mb-2">
            Barrio con Más Incidentes
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.top_barrio}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-md flex-1 min-w-[200px]">
          <div className="text-sm text-gray-400 mb-2">Tipos de Incidentes</div>
          <div className="text-2xl font-bold text-blue-400">
            {stats.incidents_by_type.length}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-md flex-1 min-w-[200px]">
          <div className="text-sm text-gray-400 mb-2">Barrios Reportados</div>
          <div className="text-2xl font-bold text-green-400">
            {stats.incidents_by_barrio.length}
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border justify-center border-[#333] rounded-lg p-5 shadow-md flex flex-wrap gap-10">
        {/* grafico torta */}
        <div className=" px-10">
          <h3 className="text-lg font-bold pl-10">
            Distribución por Tipo de Incidente (Últimas 24h)
          </h3>
          {datos.length > 0 ? (
            <PieChart width={500} height={300}>
              <Pie
                data={datos}
                dataKey="cantidad"
                nameKey="categoria"
                cx="40%"
                cy="50%"
                outerRadius={100}
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

              {/* Tooltip opcional */}
              <Tooltip />

              {/* Leyenda al costado derecho */}
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                spacing={20}
              />
            </PieChart>
          ) : (
            <p className="text-gray-500">No hay datos disponibles</p>
          )}
        </div>
        {/* top barrios */}
        <div className="flex flex-col pr-10 pl-20 flex-1 shadow-md border-gray-300 md:border-l-2">
          <h3 className="text-lg font-bold mb-10">
            Top Barrios con Más Incidentes (24h)
          </h3>
          <div className="flex flex-col gap-2 overflow-auto h-64">
            {stats.incidents_by_barrio.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-[#333]"
              >
                <span>{item._id || "Desconocido"}</span>
                <span className="text-yellow-400 font-bold">{item.count}</span>
              </div>
            ))}
            {stats.incidents_by_barrio.length === 0 && (
              <p className="text-gray-500 text-center">Sin datos de barrios</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSeguridad;
