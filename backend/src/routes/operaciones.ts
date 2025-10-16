import { Router, Request, Response } from "express";
import { Movil } from "../types/operaciones";

const router = Router();

// GET: Estado actual de móviles
router.get("/moviles", (req: Request, res: Response) => {
  const moviles = (global as any).movilesEnTiempoReal as Movil[];
  res.json(moviles || []);
});

// GET: Lista de comisarías
router.get("/comisarias", (req: Request, res: Response) => {
  const { comisarias } = require("../utils/asignacion");
  res.json(comisarias);
});

// POST: Actualizar estado de móvil (para demo)
router.post("/moviles/:id/estado", (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  const moviles = (global as any).movilesEnTiempoReal as Movil[];
  const movil = moviles.find((m: Movil) => m.id === id);

  if (movil) {
    if (
      ["disponible", "en_camino", "en_lugar", "fuera_de_servicio"].includes(
        estado
      )
    ) {
      movil.estado = estado;

      // Emitir actualización por WebSocket
      if ((global as any).wss) {
        (global as any).wss.clients.forEach((client: any) => {
          if (client.readyState === client.OPEN) {
            client.send(
              JSON.stringify({
                type: "moviles_update",
                payload: moviles,
              })
            );
          }
        });
      }
      return res.json({ success: true });
    }
    return res.status(400).json({ error: "Estado inválido" });
  }

  res.status(404).json({ error: "Móvil no encontrado" });
});

export default router;
