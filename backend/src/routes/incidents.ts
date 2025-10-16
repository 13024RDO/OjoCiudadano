import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { getBarrioFromCoords } from "../utils/geoutils";
import { uploadImage } from "../utils/cloudinary";
import { requireAdmin } from "../middleware/role";
import { UploadedFile } from "express-fileupload";

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
  //const files = req.files as { photo?: UploadedFile } | undefined;

  try {
    const { type, description } = req.body;
    let { lng, lat } = req.body;

    // Parsear coordenadas (form-data las envía como strings)
    lng = parseFloat(lng);
    lat = parseFloat(lat);

    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({ error: "Ubicación inválida" });
    }

    const barrio = getBarrioFromCoords(lng, lat);
    if (!barrio) {
      return res
        .status(400)
        .json({ error: "Ubicación fuera de Formosa Capital" });
    }

    //let photoUrl: string | null = null;
    //if (files?.photo && tiposConFoto.includes(type)) {
    //  photoUrl = await uploadImage(files.photo.data);
    //}

    const incident = new Incident({
      type,
      description,
      location: { coordinates: [lng, lat] },
      barrio,
      //photoUrl,
    });

    await incident.save();

    if (typeof (global as any).wss !== "undefined") {
      const payload = {
        type: "new_incident" as const,
        payload: {
          id: incident._id.toString(),
          type: incident.type,
          description: incident.description,
          location: incident.location.coordinates,
          barrio: incident.barrio,
          //photoUrl: incident.photoUrl,
          timestamp: incident.timestamp,
        },
      };

      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }

    return res.status(201).json({ success: true, id: incident._id.toString() });
  } catch (error) {
    console.error(error);
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
    return res.status(500).json({ error: "Error al obtener incidentes" });
  }
});

export default router;
