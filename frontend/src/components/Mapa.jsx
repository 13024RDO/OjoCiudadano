import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function MapaColores() {
  const [barrios, setBarrios] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats/summary");
        const data = await res.json();
        console.log(data);
        
        setBarrios(data.incidents_by_barrio || []);
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
      }
    };
    fetchDatos();
  }, []);

  // Coordenadas de los barrios
  const coordenadasBarrios = {
    "San Miguel": [-26.1841, -58.1781],
    "17 de Octubre": [-26.187, -58.156],
    "Eva Perón": [-26.13818 , -58.15630],
    "Villa del Carmen": [-26.198, -58.234],
    "San Martín": [-26.166, -58.199],
    "Don Bosco": [-26.184, -58.192],
    "Mariano Moreno": [-26.191, -58.168],
    "La Pilar": [-26.203, -58.216],
    "Divino Niño": [-26.160, -58.207],
    "Villa Hermosa": [-26.210, -58.184],
    "Parque Urbano": [-26.175, -58.225],
  };

  // Función para definir color según cantidad
  const obtenerColor = (cantidad) => {
    if (cantidad > 10) return "red";      // 🔴 alto peligro
    if (cantidad > 3) return "orange";    // 🟠 medio
    return "green";                       // 🟢 bajo
  };

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <MapContainer
        center={[-26.185, -58.183]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {barrios.map((barrio, index) => {
          const coords = coordenadasBarrios[barrio._id];
          if (!coords) return null;

          return (
            <Circle
              key={index}
              center={coords}
              radius={400} // tamaño del área
              pathOptions={{
                color: obtenerColor(barrio.count),
                fillColor: obtenerColor(barrio.count),
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <b>{barrio._id}</b>
                <br />
                Incidentes: {barrio.count}
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
