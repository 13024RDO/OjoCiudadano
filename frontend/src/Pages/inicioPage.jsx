import Header from "../components/Header";
import Nav from "../components/Nav";
import SeccionesNav from "../components/Secciones";
import "@fontsource/poppins";

export default function Inicio() {
  return (
    <div className="bg-black text-white overflow-auto scrollbar-hide grid grid-rows-[auto_auto_1fr] h-screen">
      <Header />
      <Nav />
      <div className="p-5">
        <SeccionesNav />
      </div>
    </div>
  );
}
