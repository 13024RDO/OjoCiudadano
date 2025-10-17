import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconMarker = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapaSelector({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return null;
}

export default function Reportes() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // 👈 nuevo estado

  const subirForm = async (e) => {
    e.preventDefault();

    if (!type || lat === null || lng === null) {
      alert("Debes seleccionar un tipo y un punto en el mapa");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    formData.append("lat", lat);
    formData.append("lng", lng);

    try {
      const res = await fetch("http://localhost:3000/api/incidents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al enviar el formulario");
      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      // ✅ Mostrar mensaje de éxito
      setSuccessMessage("Reportado con éxito");
      // Opcional: limpiar el formulario
      setType("");
      setDescription("");
      setLat(null);
      setLng(null);

      // Opcional: ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al enviar el reporte. Inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={subirForm} className="flex flex-col gap-4 p-4">
      {/* Mostrar mensaje de éxito si existe */}
      {successMessage && (
        <div className="bg-green-100 w-[200px] absolute bottom-4 right-4  text-green-700 p-2 rounded text-center">
          {successMessage}
        </div>
      )}

      <div>
        <label>Tipo de incidente:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Seleccionar tipo</option>
          <option value="robo_moto">Robo de moto</option>
          <option value="robo_bici">Robo de bici</option>
          <option value="robo_vehiculo">Robo de vehículo</option>
          <option value="abandono_vehiculo">Abandono de vehículo</option>
          <option value="daño_luminaria">Daño de luminaria</option>
          <option value="basura_acumulada">Basura acumulada</option>
          <option value="sospechoso">Sospechoso</option>
          <option value="riña">Pelea</option>
          <option value="ruido_molestia">Ruido molesto</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div>
        <label>Descripción (opcional):</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Selecciona el punto en el mapa:</label>
        <MapContainer
          center={[-26.185, -58.173]}
          zoom={13}
          style={{ height: "300px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapaSelector setLat={setLat} setLng={setLng} />
          {lat && lng && <Marker position={[lat, lng]} icon={iconMarker} />}
        </MapContainer>
        <p>
          Latitud: {lat?.toFixed(5)} | Longitud: {lng?.toFixed(5)}
        </p>
      </div>

      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Enviar reporte
      </button>
    </form>
  );
}
