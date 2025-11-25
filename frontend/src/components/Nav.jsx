// src/components/Nav.jsx
import React from "react";
import { MdLocationOn, MdReport } from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import { GoAlertFill } from "react-icons/go";
import { useSecciones } from "../../context/SeccionContext";
import { getCurrentUser } from "../utils/auth";

const Seccion = ({ texto, icono: Icono, id }) => {
  const { handleClickHook, abiertoid } = useSecciones();
  const activa = abiertoid === id;

  return (
    <button
      onClick={() => handleClickHook(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg md:rounded-t-lg md:rounded-b-none transition-all duration-200 font-medium text-gray-300 hover:bg-[#0c081c] hover:text-white
         ${activa ? "bg-[#0c081c]" : " bg-gray-900"}`}
    >
      <Icono className="" />
      <span>{texto}</span>
    </button>
  );
};

export default function Nav() {
  const user = getCurrentUser();

  return (
    <nav className=" justify-center flex shadow-sm gap-4 py-3 md:py-0 flex-wrap ">
      <Seccion texto="Mapa" id={"mapa"} icono={MdLocationOn} />
      <Seccion texto="Reportar" id={"reportar"} icono={MdReport} />
      <Seccion texto="Estadísticas" id={"estadistica"} icono={ImStatsBars} />
      {user && user.rol === "admin" ? (
        <Seccion
          texto="Control de Alertas"
          id={"alertas"}
          icono={GoAlertFill}
        />
      ) : null}

      {user && user.rol === "admin" ? (
        <Seccion
          texto="Asignacion de Comisarias"
          id={"asignacion"}
          icono={MdReport}
        />
      ) : null}
    </nav>
  );
}