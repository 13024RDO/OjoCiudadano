// Tipos de incidentes permitidos
export type IncidentType =
  | "robo_moto"
  | "robo_bici"
  | "robo_vehiculo"
  | "abandono_vehiculo"
  | "daño_luminaria"
  | "basura_acumulada"
  | "sospechoso"
  | "riña"
  | "ruido_molestia"
  | "otros";

// Barrios de Formosa Capital
export type BarrioFormosa =
  | "San Miguel"
  | "Barrio Obrero"
  | "17 de Octubre"
  | "Lomas del Sur"
  | "Villa del Carmen";

// Coordenadas: [lng, lat]
export type GeoPoint = [number, number];

// Datos del incidente reportado
export interface IncidentData {
  type: IncidentType;
  description?: string;
  location: {
    type: "Point";
    coordinates: GeoPoint;
  };
  barrio: BarrioFormosa;
  photoUrl?: string | null;
  timestamp: Date;
}

// Respuesta de WebSocket
export interface WebSocketMessage {
  type: "new_incident" | "barrio_alert";
  data: any; // o tipado más específico si querés
}
