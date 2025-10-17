import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { getBarrioFromCoords } from "../utils/geoutils";
import { uploadImage } from "../utils/cloudinary";
import { requireAdmin } from "../middleware/role";
import { UploadedFile } from "express-fileupload";
import axios from 'axios'; // --- NUEVO ---

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/triaje-incidente";

const router = Router();



router.post("/", async (req: Request, res: Response) => {
  const files = req.files as { photo?: UploadedFile } | undefined;

  try {
    const { type, description, lng, lat, priority } = req.body;
    console.log(req.body);
    

    if (typeof lng !== "number" || typeof lat !== "number") {
      return res.status(400).json({ error: "Ubicación inválida" });
    }

    const barrio = getBarrioFromCoords(lng, lat);
    if (!barrio) {
      return res
        .status(400)
        .json({ error: "Ubicación fuera de Formosa Capital" });
    }


    

    const incident = new Incident({
      type,
      description,
      location: { coordinates: [lng, lat] },
      barrio,
      priority// --- NUEVO --- Estado inicial
    });

    await incident.save();

    // --- LÓGICA DE NOTIFICACIÓN EXISTENTE (se mantiene) ---
    if (typeof (global as any).wss !== "undefined") {
      const payload = {
        type: "new_incident" as const,
        payload: {
          id: incident._id.toString(),
          type: incident.type,
          description: incident.description,
          location: incident.location.coordinates,
          barrio: incident.barrio,
          photoUrl: incident.photoUrl,
          timestamp: incident.timestamp,
          priority: incident.priority, // Enviamos el estado inicial
        },
      };

      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }

    // --- NUEVO: Enviar a n8n para análisis de IA ---
    axios.post(N8N_WEBHOOK_URL, {
        incidentId: incident._id.toString(),
        description: incident.description,
        type: incident.type,
      }).catch(error => {
          // No bloqueamos la respuesta al usuario si n8n falla
          console.error('🔴 Error al contactar el webhook de n8n:', error.message);
      });

    return res.status(201).json({ success: true, id: incident._id.toString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear incidente" });
  }
});

// --- NUEVA RUTA COMPLETA ---
// Esta ruta la llamará n8n cuando termine de analizar
router.post("/update-priority", async (req: Request, res: Response) => {
  const { incidentId, priority, reason } = req.body;

  if (!incidentId || !priority) {
    return res.status(400).json({ error: "Faltan incidentId o priority" });
  }

  try {
    // 1. Actualiza la prioridad en la base de datos
    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      { priority: priority },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedIncident) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    // 2. Notifica a todos los clientes del cambio de prioridad vía WebSocket
    if (typeof (global as any).wss !== "undefined") {
      const payload = {
        type: "incident_priority_updated" as const,
        payload: {
          id: incidentId,
          priority: priority,
          reason: reason || "Prioridad asignada por el sistema de IA."
        },
      };

      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }
    
    console.log(`✅ Prioridad actualizada para ${incidentId} a "${priority}". Razón: ${reason}`);
    res.sendStatus(200);

  } catch (error) {
    console.error('🔴 Error al actualizar la prioridad:', error);
    return res.status(500).json({ error: "Error interno al actualizar la prioridad" });
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
