import { useSecciones } from "../../context/SeccionContext";

import MapaIncidentes from "./Mapa";
import Reportes from "./Reportes";
import AlertSystem from "./Alertas";
import DashboardSeguridad from "./Estadisticas";
import OperacionesPage from "../Pages/OperacionesPage";

export default function SeccionesNav() {
  const { abiertoid } = useSecciones();

  return (
    <div className="bg-[#06040f] w-full h-full">
      {abiertoid === "reportar" && <Reportes />}

      {abiertoid === "mapa" && <MapaIncidentes />}

      {abiertoid === "alertas" && <AlertSystem />}

      {abiertoid === "estadistica" && <DashboardSeguridad />}

      {abiertoid === "operaciones" && <OperacionesPage />}
    </div>
  );
}
