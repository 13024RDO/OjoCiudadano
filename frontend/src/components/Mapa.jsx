import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// :small_blue_diamond: Solución para evitar error de íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaIncidentes() {
  const [barrios, setBarrios] = useState([]);

  // :small_blue_diamond: Obtener datos del backend
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/stats/summary");
        const data = await res.json();
        setBarrios(data.incidents_by_barrio || []);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
      }
    };

    fetchDatos();
  }, []);

  // :small_blue_diamond: Coordenadas aproximadas de los barrios
  const coordenadasBarrios = {
    "San Miguel": [-26.1841, -58.1781],
    "Barrio Obrero": [-26.1792, -58.1722],
    "17 de Octubre": [-26.1901, -58.1856],
    "Lomas del Sur": [-26.1987, -58.1912],
    "Villa del Carmen": [-26.1723, -58.1654],
    "Don Bosco": [-26.1758, -58.1635],
    Independencia: [-26.172, -58.1821],
    "San Francisco": [-26.1953, -58.1765],
    "Virgen del Rosario": [-26.1799, -58.1888],
    "Mariano Moreno": [-26.1834, -58.1945],
    "La Floresta": [-26.1811, -58.2041],
    "El Pucú": [-26.1948, -58.2166],
    "San Agustín": [-26.1891, -58.2089],
    Liborsi: [-26.1745, -58.1993],
    "Itatí I": [-26.1688, -58.2065],
    Evita: [-26.2025, -58.1802],
    "Juan Domingo Perón": [-26.1795, -58.2324],
    Guadalupe: [-26.1831, -58.1611],
    "2 de Abril": [-26.1754, -58.2123],
    Fontana: [-26.168, -58.19],
    "Parque Urbano": [-26.1599, -58.1875],
    Incone: [-26.1622, -58.202],
    "San José Obrero": [-26.191, -58.1691],
    Fleming: [-26.1678, -58.175],
    "La Nueva Formosa": [-26.2083, -58.2431],
    "Eva Perón": [-26.13448, -58.15816],
  };

  // :small_blue_diamond: Función para determinar color por nivel de peligro
  const obtenerColor = (count) => {
    if (count === 0) return "#10b981"; // Verde
    if (count <= 3) return "#fbbf24"; // Amarillo
    return "#ef4444"; // Rojo
  };

  return (
    <div className="flex flex-wrap gap-6 w-full h-[430px]">
      {/* :map: Contenedor del mapa */}
      <div className="md:w-[900px] w-full rounded-2xl overflow-hidden shadow-xl">
        <MapContainer
          center={[-26.177, -58.178]} // Centro de Formosa
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* :red_circle: Círculos sobre cada barrio */}
          {barrios.map((barrio, i) => {
            const coords = coordenadasBarrios[barrio._id];
            if (!coords) return null;

            const count = barrio.count;
            const color = obtenerColor(count);
            const radius = Math.max(200, count * 80); // más casos = círculo más grande

            return (
              <Circle
                key={i}
                center={coords}
                radius={radius}
                color={color}
                fillColor={color}
                fillOpacity={0.3}
                weight={2}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-blue-600">{barrio._id}</h3>
                    <p>
                      <span className="font-semibold">Incidentes:</span> {count}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>

      {/* :bell: Panel de notificaciones */}
      <div className="md:w-[500px] w-full h-[430px] overflow-auto scrollbar-hide bg-gray-900 text-white rounded-2xl shadow-xl p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">🔔</span> Alertas por Barrio
        </h2>
        <div className="flex-1 space-y-3">
          {barrios.length > 0 ? (
            barrios.map((barrio, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  barrio.count >= 4
                    ? "bg-red-900/30 border-red-500"
                    : barrio.count >= 2
                    ? "bg-amber-900/30 border-amber-500"
                    : "bg-green-900/30 border-green-500"
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {barrio.count >= 4 ? "🚨" : barrio.count >= 2 ? "⚠️" : "✅"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      ¡{barrio.count >= 2 ? "Alerta" : "Actividad"} en{" "}
                      {barrio._id}!
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      Hay{" "}
                      <span className="font-semibold text-white">
                        {barrio.count}
                      </span>{" "}
                      {barrio.count === 1 ? "incidente" : "incidentes"}{" "}
                      reportado
                      {barrio.count !== 1 ? "s" : ""} en las últimas 24h.
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay incidentes recientes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
