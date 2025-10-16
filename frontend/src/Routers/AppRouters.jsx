import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashBoard, Inicio } from "./pages";

const AppRouters = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio/>}/>
                <Route path="/dashboard" element={<DashBoard/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouters