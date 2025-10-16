import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export const GraficoTorta = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // cambiar la url a la que va venit del backend
        const respuesta = await fetch("http://localhost:4500/api/estadisticas");
        const data = await respuesta.json();
        setDatos(data); 
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  const colores = ["#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA"];

  return (
    <div className="flex flex-col items-center bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Distribución de Ventas</h2>

      <PieChart width={400} height={400}>
        <Pie
          data={datos}
          dataKey="cantidad"
          nameKey="categoria"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {datos.map((entry, index) => (
            <Cell key={`cell-index`} fill={colores[index % colores.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
