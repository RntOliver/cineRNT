import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home";
import Filme from "./Pages/Filme";
import Header from "./Components/Header"

function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/> }></Route>
                <Route path="/Filmee/:id" element={ <Filme/> }></Route>
                <Route path="Header/" element={ <Header/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;