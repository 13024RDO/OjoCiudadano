import { useSecciones } from "../../context/SeccionContext"
import { GraficoTorta } from "./Estadisticas"
import MapaColores from "./Mapa"
import Reportes from "./Reportes"

export default function SeccionesNav(){
    const {abiertoid } = useSecciones()
    return(
        <div className="bg-[#06040f] flex justify-center overflow-auto scrollbar-hide sm:px-[10%] md:px-[15%] lg:px-[25%] xl:px-[32%] w-full h-full">
            {abiertoid === "reportar" &&
                <Reportes/>
            }   

             {abiertoid === "estadistica" &&
               <GraficoTorta/> 
            } 

            {abiertoid === "mapa" &&
               <MapaColores/> 
            }   
                  
        </div>
    )
}