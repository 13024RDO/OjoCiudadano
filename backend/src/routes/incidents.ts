import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { getBarrioFromCoords } from "../utils/geoutils";
import { uploadImage } from "../utils/cloudinary";
import { requireAdmin } from "../middleware/role";
import { UploadedFile } from "express-fileupload";
import { asignarComisariaYMovil } from "../utils/asignacion";

const router = Router();

const tiposConFoto: string[] = [
  "robo_moto",
  "robo_bici",
  "robo_vehiculo",
  "abandono_vehiculo",
  "daño_luminaria",
  "basura_acumulada",
];

router.post("/", async (req: Request, res: Response) => {
  const files = req.files as { photo?: UploadedFile } | undefined;

  try {
    const { type, description } = req.body;
    let { lng, lat } = req.body;

    // Parsear coordenadas (form-data las envía como strings)
    lng = parseFloat(lng);
    lat = parseFloat(lat);

    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({ error: "Ubicación inválida" });
    }

    // ✅ Asignación automática de comisaría y móvil
    const { comisaria, movil } = await asignarComisariaYMovil(lng, lat);

    let photoUrl: string | null = null;
    if (
      files?.photo?.data &&
      files.photo.data.length > 0 &&
      tiposConFoto.includes(type)
    ) {
      photoUrl = await uploadImage(files.photo.data);
    }

    // ✅ Construir el objeto de incidente SIN campos nulos innecesarios
    const incidentData: any = {
      type,
      description: description || undefined,
      location: { coordinates: [lng, lat] },
      barrio: getBarrioFromCoords(lng, lat) || "Desconocido",
      photoUrl: photoUrl || undefined,
    };

    // Solo agregar comisariaAsignada si existe
    if (comisaria?.nombre) {
      incidentData.comisariaAsignada = comisaria.nombre;
    }

    // Solo agregar movilAsignado si existe
    if (movil) {
      incidentData.movilAsignado = {
        id: movil._id.toString(),
        patente: movil.patente,
        estado: movil.estado,
      };
    }

    const incident = new Incident(incidentData);
    await incident.save();

    // Emitir por WebSocket
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
