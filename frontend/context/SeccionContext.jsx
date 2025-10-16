import { createContext, useContext, useState } from "react";

const SeccionPaginaContext = createContext()

export const SeccionPaginaProvider = ({children}) => {
    const [abiertoid, setAbiertoId] = useState(null)


    const handleClickHook = (id) => {
        setAbiertoId(abiertoid === id ? null : id)
    }

    return(
        <SeccionPaginaContext.Provider value={{handleClickHook, abiertoid, setAbiertoId}}>
            {children}
        </SeccionPaginaContext.Provider>
    )
}

export const useSecciones = () => useContext(SeccionPaginaContext)