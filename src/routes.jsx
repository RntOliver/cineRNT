import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home";
import Filme from "./Pages/Filme";
import Header from "./Components/Header";
import Error from "./Pages/Error"

function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/> }></Route>
                <Route path="/Filme/:id" element={ <Filme/> }></Route>
                <Route path="Header/" element={ <Header/> }/>

                <Route path="*" element={ <Error/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;