// src/routes/operaciones.ts
import { Router, Request, Response } from "express";
import Movil from "../models/Movil";
import Comisaria from "../models/Comisaria";

const router = Router();

// GET: Lista de móviles
router.get("/moviles", async (req: Request, res: Response) => {
  try {
    const moviles = await Movil.find().select("-__v");
    res.json(moviles);
  } catch (error) {
    console.error("Error al obtener móviles:", error);
    res.status(500).json({ error: "Error al cargar móviles" });
  }
});

// GET: Lista de comisarías
router.get("/comisarias", async (req: Request, res: Response) => {
  try {
    const comisarias = await Comisaria.find().select("-__v");
    res.json(comisarias);
  } catch (error) {
    console.error("Error al obtener comisarías:", error);
    res.status(500).json({ error: "Error al cargar comisarías" });
  }
});
// GET: Comisarías con sus móviles (en tiempo real)
router.get("/comisarias-con-moviles", async (req: Request, res: Response) => {
  try {
    const comisarias = await Comisaria.find().select("-__v");
    const moviles = await Movil.find().select("-__v");

    // Agrupar móviles por comisaría
    const comisariasConMoviles = comisarias.map((comi) => {
      const movilesDeComisaria = moviles.filter(
        (m) => m.comisariaId.toString() === comi._id.toString()
      );
      return {
        ...comi.toObject(),
        moviles: movilesDeComisaria,
      };
    });

    res.json(comisariasConMoviles);
  } catch (error) {
    console.error("Error al obtener comisarías con móviles:", error);
    res.status(500).json({ error: "Error al cargar datos" });
  }
});

// POST: Actualizar estado de un móvil
router.post("/moviles/:id/estado", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (
      !["disponible", "en_camino", "en_lugar", "fuera_de_servicio"].includes(
        estado
      )
    ) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const movil = await Movil.findByIdAndUpdate(id, { estado }, { new: true });

    if (!movil) {
      return res.status(404).json({ error: "Móvil no encontrado" });
    }

    // Emitir actualización por WebSocket
    if ((global as any).wss) {
      const allMoviles = await Movil.find().select("-__v");
      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(
            JSON.stringify({
              type: "moviles_update",
              payload: allMoviles,
            })
          );
        }
      });
    }

    res.json({ success: true, movil });
  } catch (error) {
    console.error("Error al actualizar móvil:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

export default router;
