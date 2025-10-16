import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // 👈 importante

// 🔹 Ícono personalizado (usarás el clásico de Leaflet)
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
//   const [photoUrl, setPhoto] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

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
    // if(photoUrl) formData.append("photo", photoUrl);

    try {
      const res = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al enviar el formulario");
      const data = await res.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={subirForm} className="flex w-full h-[500px] flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <label>Tipo de incidente:</label>
        <select className="[&>option]:text-black w-[50%] py-1 px-4 border-2 rounded border-white " value={type} onChange={(e) => setType(e.target.value)}>
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

      <div className="flex flex-col gap-2">
        <label>Descripción (opcional):</label>
        <input
        className= "border-2 py-1 px-4 border-white rounded"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

{/* mapa */}
      <div className="flex flex-col gap2">
        <label>Selecciona ubicacion del incidente:</label>
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
      </div>

      {/* <div>
        <label>Foto (opcional):</label>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
      </div> */}

      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Enviar reporte
      </button>
    </form>
  );
}
