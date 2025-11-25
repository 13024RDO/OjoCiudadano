import Comisaria from "../models/Comisaria";

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

// ✅ Solo asigna comisaría, sin móviles
export async function asignarComisaria(lng: number, lat: number) {
  try {
    const comisarias = await Comisaria.find();
    if (comisarias.length === 0) return null;

    let comisariaCercana = comisarias[0];
    let minDist = haversineDistance(
      { lat, lng },
      {
        lat: comisariaCercana.location.coordinates[1],
        lng: comisariaCercana.location.coordinates[0],
      }
    );

    for (let i = 1; i < comisarias.length; i++) {
      const comi = comisarias[i];
      const dist = haversineDistance(
        { lat, lng },
        {
          lat: comi.location.coordinates[1],
          lng: comi.location.coordinates[0],
        }
      );
      if (dist < minDist) {
        minDist = dist;
        comisariaCercana = comi;
      }
    }

    return comisariaCercana;
  } catch (error) {
    console.error("Error al asignar comisaría:", error);
    return null;
  }
}