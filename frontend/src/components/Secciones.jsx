import { useSecciones } from "../../context/SeccionContext";
import Reportes from "./Reportes";
import DashboardSeguridad from "./Estadisticas";
import MapaColores from "./Mapa";
import MapaYAlertas from "./Operaciones";

import AsignacionComisarias from "./AsignacionComisarias";
export default function SeccionesNav() {
  const { abiertoid } = useSecciones();
  return (
    <div className="bg-[#0c081c] p-8 flex justify-center items-center overflow-auto scrollbar-hide w-full h-full">
      {abiertoid === "reportar" && <Reportes />}

      {abiertoid === "estadistica" && <DashboardSeguridad />}

      {abiertoid === "mapa" && <MapaColores />}

      {abiertoid === "alertas" && <MapaYAlertas />}

      {abiertoid === "asignacion" && <AsignacionComisarias />}
    </div>
  );
}
