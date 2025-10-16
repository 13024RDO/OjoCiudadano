import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
 

export default function Reportes(){
    const [type, SetType]= useState("")
    const [description, SetDescription]= useState("")
    const [lat, SetLat] = useState(null)
    const [lng, SetLng] = useState(null)
    const [photo, SetPhoto]= useState(null)

    // componente para detectar clic dentro del mapa
    function LocationMarker(){
        useMapEvents({
            click(e){
                SetLat(e.latlng.lat)
                SetLng(e.latlng.lng)                
            }
        })

        return lat && lng ? <Marker position={[lat, lng]}  icon={markerIcon}/> : null
    }


    const subirForm = async (e) => {
        e.preventDefault()

        if(!lat || !lng){
            alert("Por favor seleccione un punto en el mapa")
            return;
        }

        const formData = new FormData
        formData.append("type", type)
        formData.append("description", description)
        formData.append("lat", lat)
        formData.append("lng", lng)
        formData.append("photo", photo)

        try {
            const res = fetch("http://localhost:5000/api/incidents ",{
                method: "POST",
                body: formData
            })

            if(!res.ok) throw new Error("Errir al enviar el formulario")
            const data =  await res.json()
            console.log("Respuesta del servidor,", data);
            
        } catch (error) {
            console.error("Error", error);
            
        }
    }

    return(
        <form action="">
            <label htmlFor="">Selecciona un tipo</label>
            <select value={type} onChange={(e)=>SetType(e.target.value)}>
                <option value="robo_moto">Robo de moto</option>
                <option value="robo_bici">Robo de bici</option>
                <option value="robo_vehiculo">Robo de vehiculo</option>
                <option value="abandono_vehiculo">Abandono de vehiculo</option>
                <option value="daño_luminaria">Daño luminario</option>
                <option value="basura_acumulada">Basura acumulada</option>
                <option value="sospechoso">Sospechoso</option>
                <option value="riña">Pelea</option>
                <option value="ruido_molestia">Ruido molesto</option>
                <option value="otros">Otros</option>
            </select>
            
            <div className="">
                <label htmlFor="">Descripcion</label>
                <input 
                    type="text"
                    value={description}
                    onChange={(e)=> SetDescription(e.target.value)} />
            </div>

            <div className="">
                <label>Selecciona el punto en el mapa</label>
                    <MapContainer
                      center={[]}
                      zoom={13}
                      style={{ height: "300px", width: "100%" }}>
                        
                    </MapContainer>           
                </div>

            <div className="">
                <label htmlFor="">Photo</label>
                <input 
                    type="file"
                    onChange={(e)=>SetPhoto(e.target.files[0])} />
            </div>

            <button type="submit">
                Enviar reporte
            </button>
        </form>
    )
 }