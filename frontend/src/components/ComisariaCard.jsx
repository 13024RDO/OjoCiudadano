// src/components/ComisariaCard.js
import React from "react";

const ESTADOS = {
  disponible: { label: "Disponible", color: "bg-green-100 text-green-800" },
  en_camino: { label: "En camino", color: "bg-yellow-100 text-yellow-800" },
  en_lugar: { label: "En el lugar", color: "bg-red-100 text-red-800" },
  fuera_de_servicio: {
    label: "Fuera de servicio",
    color: "bg-gray-100 text-gray-800",
  },
};

export default function ComisariaCard({ comi, moviles }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <h3 className="text-lg font-bold text-blue-700 mb-1">{comi.nombre}</h3>
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
        {comi.direccion}
      </p>
      <p className="text-xs text-gray-500 mb-3">📞 {comi.telefono}</p>

      <h4 className="font-semibold text-gray-700 mb-2">Móviles:</h4>
      {moviles && moviles.length > 0 ? (
        <div className="space-y-2">
          {moviles.map((movil) => {
            const estado = ESTADOS[movil.estado] || ESTADOS.disponible;
            return (
              <div
                key={movil._id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm font-medium">🚗 {movil.patente}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${estado.color}`}
                >
                  {estado.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay móviles asignados</p>
      )}
    </div>
  );
}
