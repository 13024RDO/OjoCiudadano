// src/components/Nav.jsx
import React from "react";
import { MdLocationOn, MdReport } from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import { GoAlertFill } from "react-icons/go";
import { useSecciones } from "../../context/SeccionContext";
import { getCurrentUser } from "../utils/auth";

const Seccion = ({ texto, icono: Icono, id }) => {
  const { handleClickHook } = useSecciones();

  return (
    <button
      onClick={() => handleClickHook(id)}
      className="flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-gray-300 hover:bg-gray-800 hover:text-white "
    >
      <Icono className="" />
      <span>{texto}</span>
    </button>
  );
};

export default function Nav() {
  const user = getCurrentUser();

  return (
    <nav className="bg-black p-3 justify-center flex shadow-sm space-x-4 flex-wrap ">
      <Seccion texto="Mapa" id={"mapa"} icono={MdLocationOn} />
      <Seccion texto="Reportar" id={"reportar"} icono={MdReport} />
      <Seccion texto="Estadísticas" id={"estadistica"} icono={ImStatsBars} />
      <Seccion texto="Alertas" id={"alertas"} icono={GoAlertFill} />
      {user && user.rol === "admin" ? (
        <Seccion texto="Operaciones" id={"operaciones"} icono={GoAlertFill} />
      ) : null}
    </nav>
  );
}
