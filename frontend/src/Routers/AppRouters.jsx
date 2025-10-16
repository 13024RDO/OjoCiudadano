import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio, OperacionesPage, MapaDeCalor } from "./Pages";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/operaciones" element={<OperacionesPage />} />
        <Route path="/mapacalor" element={<MapaDeCalor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
