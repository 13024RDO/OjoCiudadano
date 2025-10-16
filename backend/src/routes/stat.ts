import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { requireAdmin } from "../middleware/role";

const router = Router();

router.get("/summary", async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const total24h = await Incident.countDocuments({
      timestamp: { $gte: last24h },
    });

    const porBarrio = await Incident.aggregate([
      { $match: { timestamp: { $gte: last24h } } },
      {
        $group: {
          _id: "$barrio",
          location: { $first: "$location" },
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
    ]);

    const porTipo = await Incident.aggregate([
      { $match: { timestamp: { $gte: last24h } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    res.json({
      total_last_24h: total24h,
      top_barrio: porBarrio[0]?._id || null,
      incidents_by_barrio: porBarrio,
      incidents_by_type: porTipo,
    });
  } catch (error) {
    res.status(500).json({ error: "Error en estadísticas" });
  }
});
// GET: Estadísticas de incidentes por barrio (para mapa de calor)
// GET: Estadísticas de incidentes por barrio (para mapa de calor)
router.get("/barrios-calor", async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stats = await Incident.aggregate([
      { $match: { timestamp: { $gte: last24h } } },
      { $group: { _id: "$barrio", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Formato: { "Liborsi": 5, "San Miguel": 3, ... }
    const barriosCalor: Record<string, number> = {};
    stats.forEach((item) => {
      barriosCalor[item._id] = item.count;
    });

    res.json(barriosCalor);
  } catch (error) {
    console.error("Error en /barrios-calor:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

router.get("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const daily = await Incident.aggregate([
      { $match: { timestamp: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const conFoto = await Incident.countDocuments({ photoUrl: { $ne: null } });

    const barriosActivos = await Incident.distinct("barrio", {
      timestamp: { $gte: last7Days },
    });

    res.json({
      daily_trend: daily,
      total_with_photo: conFoto,
      active_barrios: barriosActivos,
    });
  } catch (error) {
    res.status(500).json({ error: "Error en estadísticas admin" });
  }
});

export default router;
