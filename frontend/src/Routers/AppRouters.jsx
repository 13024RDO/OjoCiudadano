import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio, LoginPage } from "./pages";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
