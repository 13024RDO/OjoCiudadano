import { Router, Request, Response } from 'express';
import Incident from '../models/Incident';
import { getBarrioFromCoords } from '../utils/geoutils';
import { uploadImage } from '../utils/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '../middleware/role';

const router = Router();

const tiposConFoto: string[] = [
  'robo_moto', 'robo_bici', 'robo_vehiculo',
  'abandono_vehiculo', 'daño_luminaria', 'basura_acumulada'
];

interface CustomRequest extends Request {
  files?: {
    photo?: {
      data: Buffer;
    };
  };
}

router.post('/', async (req: CustomRequest, res: Response) => {
  try {
    const { type, description, lng, lat } = req.body;

    if (typeof lng !== 'number' || typeof lat !== 'number') {
      return res.status(400).json({ error: 'Ubicación inválida' });
    }

    const barrio = getBarrioFromCoords(lng, lat);
    if (!barrio) {
      return res.status(400).json({ error: 'Ubicación fuera de Formosa Capital' });
    }

    let photoUrl: string | null = null;
    if (req.files?.photo && tiposConFoto.includes(type)) {
      photoUrl = await uploadImage(req.files.photo.data);
    }

    const incident = new Incident({
      type,
      description,
      location: { coordinates: [lng, lat] },
      barrio,
      photoUrl
    });

    await incident.save();

    // Emitir por WebSocket
    if (typeof (global as any).wss !== 'undefined') {
      const payload = {
        type: 'new_incident' as const,
         {
          id: incident._id.toString(),
          type: incident.type,
          description: incident.description,
          location: incident.location.coordinates,
          barrio: incident.barrio,
          photoUrl: incident.photoUrl,
          timestamp: incident.timestamp
        }
      };

      (global as any).wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    }

    res.status(201).json({ success: true, id: incident._id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear incidente' });
  }
});

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .select('-__v');
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
});

export default router;