import React from "react";

const ESTADOS = {
  disponible: { label: "Disponible", color: "green" },
  en_camino: { label: "En camino", color: "orange" },
  en_lugar: { label: "En el lugar", color: "red" },
  fuera_de_servicio: { label: "Fuera de servicio", color: "gray" },
};

export default function MovilCard({ movil }) {
  const estado = ESTADOS[movil.estado] || ESTADOS.disponible;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h4>Patente: {movil.patente}</h4>
      <p>
        Estado:
        <span
          style={{
            color: estado.color,
            fontWeight: "bold",
            marginLeft: "6px",
          }}
        >
          {estado.label}
        </span>
      </p>
    </div>
  );
}
