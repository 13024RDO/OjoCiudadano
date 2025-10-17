// src/routes/auth.ts
import { Router, Request, Response } from "express";
import User from "../models/User";

const router = Router();

// POST /api/auth/login → login simple por email
router.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requerido" });
  }

  // Buscar o crear usuario (para hackatón)
  let user = await User.findOne({ email });
  if (!user) {
    // En hackatón: permitir crear cualquier usuario
    // En producción: solo emails autorizados
    const rol =
      email.includes("policia") || email.includes("admin")
        ? "admin"
        : "ciudadano";
    user = new User({ email, rol });
    await user.save();
  }

  // Devolver usuario (sin token, solo datos)
  res.json({
    id: user._id,
    email: user.email,
    rol: user.rol,
  });
});

export default router;
