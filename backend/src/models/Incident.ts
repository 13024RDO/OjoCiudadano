import { model, Schema } from 'mongoose';
import { IncidentData, IncidentType } from '../types';

const incidentSchema = new Schema<IncidentData>(
  {
    type: {
      type: String,
      enum: [
        'robo_moto', 'robo_bici', 'robo_vehiculo',
        'abandono_vehiculo', 'daño_luminaria',
        'basura_acumulada', 'sospechoso',
        'riña', 'ruido_molestia', 'otros'
      ],
      required: true
    },
    description: { type: String, maxlength: 300 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    barrio: { type: String, required: true },
    photoUrl: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    priority: {
      type: String,
      enum: [3, 2, 1]
    }
  },
  { timestamps: false }
);

incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ barrio: 1, timestamp: 1, type: 1 });

export default model<IncidentData>('Incident', incidentSchema);
