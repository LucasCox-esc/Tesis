import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Inicio } from './Componentes/Inicio';
import { Login } from './Componentes/Login';
import { Registrar } from './Componentes/Registrar';
import { Home } from './Componentes/Home';
import {RealHome} from './Componentes/realhome';

function App() {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Registrar />} /> */}
                <Route path="/home" element={<Home />} />
                {/* <Route path="/realhome" element={<RealHome />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
