// src/components/Nav.jsx
import React from 'react';
import { MdLocationOn } from "react-icons/md";

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
      <Seccion texto="Reportar" icono={MdLocationOn} />
      <Seccion texto="Estadísticas" icono={MdLocationOn} />
      <Seccion texto="Alertas" icono={MdLocationOn} />
    </nav>
  );
};
 


 {/* <ul className="flex space-x-2 justify-center flex-wrap">
        {[
          { icon: '📍', label: 'Mapa' },
          { icon: '🛡️', label: 'Reportar', active: true },
          { icon: '📊', label: 'Estadísticas' },
          { icon: '🔔', label: 'Alertas' }
        ].map((item, index) => (
          <li key={index}>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                item.active
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
          
        ))}
      </ul> */}