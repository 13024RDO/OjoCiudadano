import { useSecciones } from "../../context/SeccionContext";
import Reportes from "./Reportes";
import MapaColores from "./Mapa";
import DashboardSeguridad from "./Estadisticas";
import MapaYAlertas from "./Operaciones";

import MapaIncidentes from "./Mapa";
import Reportes from "./Reportes";
import DashboardSeguridad from "./Estadisticas";
import OperacionesPage from "../Pages/OperacionesPage";
import AsignacionComisarias from "./AsignacionComisarias";
export default function SeccionesNav() {
  const { abiertoid } = useSecciones();
  return (
    <div className="bg-[#06040f] p-8 flex justify-center overflow-auto scrollbar-hide w-full h-full">
      {abiertoid === "reportar" && <Reportes />}

      {abiertoid === "estadistica" && <DashboardSeguridad />}

      {abiertoid === "mapa" && <MapaColores />}

      {abiertoid === "alertas" && <MapaYAlertas />}

      {abiertoid === "estadistica" && <DashboardSeguridad />}

      {abiertoid === "alertas" && <OperacionesPage />}
      {abiertoid === "asignacion" && <AsignacionComisarias />}
    </div>
  );
}
