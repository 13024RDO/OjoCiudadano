import { model, Schema } from 'mongoose';
import { BarrioFormosa } from '../types';

const subscriberSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  barrio: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Subscriber', subscriberSchema);