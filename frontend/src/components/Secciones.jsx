import { useSecciones } from "../../context/SeccionContext"
import { GraficoTorta } from "./Estadisticas"
import Reportes from "./Reportes"

export default function SeccionesNav(){
    const {abiertoid } = useSecciones()
    return(
        <div className="bg-[#06040f] w-full h-full">
            {abiertoid === "reportar" &&
                <Reportes/>
            }   

             {abiertoid === "estadistica" &&
               <GraficoTorta/> 
            }   
                  
        </div>
    )
}