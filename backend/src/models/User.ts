// src/models/User.ts
import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  rol: { type: String, enum: ["ciudadano", "admin"], required: true },
});

export default model("User", userSchema);
