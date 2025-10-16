import iconSrc from '../assets/ojo.png'; // 👈 Importa la imagen

export default function Header (){
  return (
    <header className="bg-black text-white p-4 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-green-600 p-2 rounded-lg">
          <img
            src={iconSrc}
            alt="Icono"
            className="h-6 w-6 invert" // 👈 'invert' lo vuelve blanco si era negro
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">OjoCiudadano</h1>
          <p className="text-sm text-gray-300">Reporta y consulta incidentes en tiempo real</p>
        </div>
      </div>
    </header>
  );
};
