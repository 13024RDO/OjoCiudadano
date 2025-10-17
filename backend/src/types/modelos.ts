// src/types/modelos.ts

export interface IUbicacion {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface IComisaria {
  _id: string;
  nombre: string;
  direccion: string;
  location: IUbicacion;
  telefono: string;
}

export interface IMovil {
  _id: string;
  patente: string;
  comisariaId: string;
  estado: "disponible" | "en_camino" | "en_lugar" | "fuera_de_servicio";
  ubicacionActual: IUbicacion;
}
