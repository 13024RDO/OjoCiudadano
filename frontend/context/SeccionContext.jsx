import { createContext, useContext, useState } from "react";

const SeccionPaginaContext = createContext();

export const SeccionPaginaProvider = ({ children }) => {
  const [abiertoid, setAbiertoId] = useState("mapa");

  const handleClickHook = (id) => {
    if (abiertoid !== id) {
      setAbiertoId(id);
    }
  };

  return (
    <SeccionPaginaContext.Provider
      value={{ handleClickHook, abiertoid, setAbiertoId }}
    >
      {children}
    </SeccionPaginaContext.Provider>
  );
};

export const useSecciones = () => useContext(SeccionPaginaContext);
