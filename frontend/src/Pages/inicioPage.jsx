import Header from "../components/Header";
import Nav from "../components/Nav";
import Reportes from "../components/Reportes";
import SeccionesNav from "../components/Secciones";

export default function Inicio(){
    return(
        <div className="bg-black overflow-auto scrollbar-hide text-white h-screen">
            <Header />
            <Nav />
            <div className="">
               <SeccionesNav/>
            </div>
        </div>
    )
}