import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Inicio } from './Componentes/Inicio';
import { Login } from './Componentes/Login';
import { Registrar } from './Componentes/Registrar';
import { Home } from './Componentes/Home';
import {RealHome} from './Componentes/realhome';
import {Roles} from './Componentes/Roles';
import Calendario from './Componentes/calendario';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route path="/home" element={<Home />} />
                <Route path="/realhome" element={<RealHome />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/calendario" element={<Calendario />} />


            </Routes>
        </Router>
    );
}

export default App;
