import { useSecciones } from "../../context/SeccionContext"
import Reportes from "./Reportes"
import MapaColores from "./Mapa"
import DashboardSeguridad from "./Estadisticas"
import MapaYAlertas from "./Operaciones"

export default function SeccionesNav(){
    const {abiertoid } = useSecciones()
    return(
        <div className="bg-[#06040f] p-8 flex justify-center overflow-auto scrollbar-hide w-full h-full">
            {abiertoid === "reportar" &&
                <Reportes/>
            }   

             {abiertoid === "estadistica" &&
               <DashboardSeguridad/> 
            } 

        

            {abiertoid === "mapa" &&
               <MapaColores/> 
            }   
                  

                   
            {abiertoid === "alertas" &&
               <MapaYAlertas/> 
            } 

        </div>
    )
}
