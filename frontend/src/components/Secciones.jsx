import { useSecciones } from "../../context/SeccionContext";

import MapaIncidentes from "./Mapa";
import Reportes from "./Reportes";
import DashboardSeguridad from "./Estadisticas";
import OperacionesPage from "../Pages/OperacionesPage";
import AsignacionComisarias from "./AsignacionComisarias";

export default function SeccionesNav() {
  const { abiertoid } = useSecciones();

  return (
    <div className="bg-[#06040f] w-full h-full">
      {abiertoid === "reportar" && <Reportes />}

      {abiertoid === "mapa" && <MapaIncidentes />}

      {abiertoid === "estadistica" && <DashboardSeguridad />}

      {abiertoid === "alertas" && <OperacionesPage />}
      {abiertoid === "asignacion" && <AsignacionComisarias />}
    </div>
  );
}
