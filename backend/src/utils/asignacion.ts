import { Comisaria, Movil } from "../types/operaciones";

const comisarias: Comisaria[] = require("../data/comisarias.json");
let moviles: Movil[] = require("../data/moviles.json");

// Hacemos accesible globalmente para actualizaciones
if (!(global as any).movilesEnTiempoReal) {
  (global as any).movilesEnTiempoReal = moviles;
}

function haversineDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
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

export function asignarComisaria(lng: number, lat: number): Comisaria | null {
  let closest: Comisaria | null = null;
  let minDist = Infinity;
  for (const comi of comisarias) {
    const dist = haversineDistance({ lat, lng }, comi.location);
    if (dist < minDist) {
      minDist = dist;
      closest = comi;
    }
  }
  return closest;
}

export function asignarMovil(
  comisariaId: string,
  lng: number,
  lat: number
): Movil | null {
  const movilesEnTiempoReal = (global as any).movilesEnTiempoReal as Movil[];
  const movilesDisponibles = movilesEnTiempoReal.filter(
    (m) => m.comisariaId === comisariaId && m.estado === "disponible"
  );

  if (movilesDisponibles.length === 0) return null;

  let closest: Movil | null = null;
  let minDist = Infinity;
  for (const movil of movilesDisponibles) {
    const dist = haversineDistance({ lat, lng }, movil.ubicacionActual);
    if (dist < minDist) {
      minDist = dist;
      closest = movil;
    }
  }
  return closest;
}

export { comisarias };
