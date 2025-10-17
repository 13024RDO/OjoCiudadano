import { Router, Request, Response } from "express";
import Incident from "../models/Incident";
import { getBarrioFromCoords } from "../utils/geoutils";
import { uploadImage } from "../utils/cloudinary";
import { requireAdmin } from "../middleware/role";
import { UploadedFile } from "express-fileupload";
<<<<<<< HEAD
import { asignarComisaria } from "../utils/asignacion"; // ← solo comisaría
=======
import { asignarComisariaYMovil } from "../utils/asignacion";
import axios from 'axios'; 

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/triaje-incidente";
>>>>>>> 119a3dd7c4b2ebc30f39038886a7bd8db9df48f8

const router = Router();



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
  //const files = req.files as { photo?: UploadedFile } | undefined;

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


    // ✅ Datos base del incidente
    const incidentData: any = {
      type,
      description: description || undefined,
      location: { coordinates: [lng, lat] },
<<<<<<< HEAD
      barrio,
      photoUrl: photoUrl || undefined,
      priority, // ← prioridad numérica
      status: "pendiente", // ← estado inicial
=======
      barrio: getBarrioFromCoords(lng, lat) || "Desconocido",
>>>>>>> 119a3dd7c4b2ebc30f39038886a7bd8db9df48f8
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

<<<<<<< HEAD
=======
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

    // --- NUEVO: Enviar a n8n para análisis de IA ---
    axios.post(N8N_WEBHOOK_URL, {
        incidentId: incident._id.toString(),
        description: incident.description,
        type: incident.type,
      }).catch(error => {
          // No bloqueamos la respuesta al usuario si n8n falla
          console.error('🔴 Error al contactar el webhook de n8n:', error.message);
      });

>>>>>>> 119a3dd7c4b2ebc30f39038886a7bd8db9df48f8
    return res.status(201).json({ success: true, id: incident._id.toString() });
  } catch (error) {
    console.error("Error al crear incidente:", error);
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
    console.error("Error al obtener incidentes:", error);
    return res.status(500).json({ error: "Error al obtener incidentes" });
  }
});

export default router;
