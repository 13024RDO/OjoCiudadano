import { model, Schema } from "mongoose";
import { IMovil } from "../types/modelos";

const movilSchema = new Schema<IMovil>({
  patente: { type: String, required: true },
  comisariaId: { type: String, required: true },
  estado: {
    type: String,
    enum: ["disponible", "en_camino", "en_lugar", "fuera_de_servicio"],
    default: "disponible",
  },
  ubicacionActual: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
});

movilSchema.index({ ubicacionActual: "2dsphere" });

export default model<IMovil>("Movil", movilSchema);
