import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { getBarrioFromCoords } from "../utils/geoutils";
import { uploadImage } from "../utils/cloudinary";
import { requireAdmin } from "../middleware/role";
import { UploadedFile } from "express-fileupload";
import { asignarComisaria } from "../utils/asignacion"; // ← solo comisaría

const router = Router();

const tiposConFoto: string[] = [
  "robo_moto",
  "robo_bici",
  "robo_vehiculo",
  "abandono_vehiculo",
  "daño_luminaria",
  "basura_acumulada",
];

// ✅ Prioridades por tipo
const prioridades: Record<string, number> = {
  robo_moto: 3,
  robo_bici: 3,
  robo_vehiculo: 3,
  sospechoso: 2,
  riña: 2,
  abandono_vehiculo: 2,
  daño_luminaria: 1,
  basura_acumulada: 1,
  ruido_molestia: 1,
  otros: 1,
};

router.post("/", async (req: Request, res: Response) => {
  const files = req.files as { photo?: UploadedFile } | undefined;

  try {
    const { type, description } = req.body;
    let { lng, lat } = req.body;

    lng = parseFloat(lng);
    lat = parseFloat(lat);

    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({ error: "Ubicación inválida" });
    }

    const barrio = getBarrioFromCoords(lng, lat) || "Desconocido";
    const priority = prioridades[type] || 1;

    let photoUrl: string | null = null;
    if (
      files?.photo?.data &&
      files.photo.data.length > 0 &&
      tiposConFoto.includes(type)
    ) {
      photoUrl = await uploadImage(files.photo.data);
    }

    // ✅ Datos base del incidente
    const incidentData: any = {
      type,
      description: description || undefined,
      location: { coordinates: [lng, lat] },
      barrio,
      photoUrl: photoUrl || undefined,
      priority, // ← prioridad numérica
      status: "pendiente", // ← estado inicial
    };

    // ✅ Asignar solo comisaría (sin móviles)
    let comisaria = null;
    try {
      comisaria = await asignarComisaria(lng, lat);
    } catch (err) {
      console.warn("⚠️ Error al asignar comisaría:", err);
    }

    if (comisaria?.nombre) {
      incidentData.comisariaAsignada = comisaria.nombre;
    }

    const incident = new Incident(incidentData);
    await incident.save();

    // ✅ Emitir por WebSocket
    if ((global as any).wss) {
      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(
            JSON.stringify({
              type: "new_incident",
              payload: incident.toObject(),
            })
          );
        }
      });
    }

    // ✅ Emitir actualización de mapa de calor
    if ((global as any).wss) {
      const statsBarrios = await Incident.aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: "$barrio", count: { $sum: 1 } } },
      ]);

      const barriosCalor: Record<string, number> = {};
      statsBarrios.forEach((item) => {
        barriosCalor[item._id] = item.count;
      });

      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(
            JSON.stringify({
              type: "barrios_calor_update",
              payload: barriosCalor,
            })
          );
        }
      });
    }

    return res.status(201).json({ success: true, id: incident._id.toString() });
  } catch (error) {
    console.error("Error al crear incidente:", error);
    return res.status(500).json({ error: "Error al crear incidente" });
  }
});

router.get("/", requireAdmin, async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .select("-__v");
    return res.json(incidents);
  } catch (error) {
    console.error("Error al obtener incidentes:", error);
    return res.status(500).json({ error: "Error al obtener incidentes" });
  }
});

export default router;
