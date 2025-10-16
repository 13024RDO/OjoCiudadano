// src/components/Nav.jsx
import React from 'react';
import { MdLocationOn,MdReport } from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import { GoAlertFill } from "react-icons/go";

const Seccion = ({texto, icono:Icono})=>{
    return(
        <div className='flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-gray-300 hover:bg-gray-800 hover:text-white '>
            <Icono className="" />
            <span>{texto}</span>
        </div>
    )
}

export default function Nav (){
  return (
    <nav className="bg-black p-3 justify-center flex shadow-sm space-x-4 flex-wrap ">
      <Seccion texto="Mapa" icono={MdLocationOn} />
      <Seccion texto="Reportar" icono={MdReport} />
      <Seccion texto="Estadísticas" icono={ImStatsBars } />
      <Seccion texto="Alertas" icono={GoAlertFill} />
    </nav>
  );
};
 
