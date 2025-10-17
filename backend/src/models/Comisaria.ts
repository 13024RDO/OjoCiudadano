import { model, Schema } from "mongoose";
import { IComisaria } from "../types/modelos";

const comisariaSchema = new Schema<IComisaria>({
  nombre: { type: String, required: true },
  direccion: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  telefono: String,
});

comisariaSchema.index({ location: "2dsphere" });

export default model<IComisaria>("Comisaria", comisariaSchema);
