import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Inicio } from "./Pages";

const AppRouters = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio/>}/>
               
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouters