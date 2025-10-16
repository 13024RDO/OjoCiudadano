export interface Comisaria {
  id: string;
  nombre: string;
  direccion: string;
  location: { lng: number; lat: number };
  telefono: string;
}

export interface Movil {
  id: string;
  patente: string;
  comisariaId: string;
  estado: "disponible" | "en_camino" | "en_lugar" | "fuera_de_servicio";
  ubicacionActual: { lng: number; lat: number };
}

export interface AsignacionResultado {
  comisaria: Comisaria | null;
  movil: Movil | null;
}
