import barrios from '../data/barrios-formosa.json';
import { BarrioFormosa } from '../types';

interface Coords {
  lat: number;
  lng: number;
}

function haversineDistance(coord1: Coords, coord2: Coords): number {
  const R = 6371e3;
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getBarrioFromCoords(lng: number, lat: number): BarrioFormosa | null {
  let closest: string | null = null;
  let minDist = Infinity;

  for (const barrio of barrios) {
    const dist = haversineDistance({ lat, lng }, barrio.centro);
    if (dist < minDist) {
      minDist = dist;
      closest = barrio.nombre;
    }
  }

  return closest as BarrioFormosa | null;
}