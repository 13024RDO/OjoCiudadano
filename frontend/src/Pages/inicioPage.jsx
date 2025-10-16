import Header from "../components/Header";
import Nav from "../components/Nav";
import Reportes from "../components/Reportes";
import SeccionesNav from "../components/Secciones";

export default function Inicio(){
    return(
        <div className="bg-black text-white grid grid-rows-[auto_auto_1fr] h-screen">
            <Header />
            <Nav />
            <div className="p-5">
               <SeccionesNav/>
            </div>
        </div>
    )
}