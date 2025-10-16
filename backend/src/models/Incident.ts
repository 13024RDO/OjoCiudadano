import { model, Schema } from "mongoose";

const incidentSchema = new Schema({
  type: {
    type: String,
    enum: [
      "robo_moto",
      "robo_bici",
      "robo_vehiculo",
      "abandono_vehiculo",
      "daño_luminaria",
      "basura_acumulada",
      "sospechoso",
      "riña",
      "ruido_molestia",
      "otros",
    ],
    required: true,
  },
  description: { type: String, maxlength: 300 },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  barrio: { type: String, required: true },
  photoUrl: { type: String, default: null },

  // 🔹 Campos de asignación operativa (corregidos)
  comisariaAsignada: { type: String }, // sin default

  movilAsignado: {
    id: String,
    patente: String,
    estado: {
      type: String,
      enum: ["disponible", "en_camino", "en_lugar", "fuera_de_servicio"],
    },
  },

  timestamp: { type: Date, default: Date.now },
});

// Índices
incidentSchema.index({ location: "2dsphere" });
incidentSchema.index({ barrio: 1, timestamp: 1, type: 1 });

export default model("Incident", incidentSchema);
