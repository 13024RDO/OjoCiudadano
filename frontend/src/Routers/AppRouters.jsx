import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio, OperacionesPage } from "./Pages";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/operaciones" element={<OperacionesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
