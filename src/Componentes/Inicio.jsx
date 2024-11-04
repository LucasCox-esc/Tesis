import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Registrar } from './Registrar';

export const Inicio = () => {
    const navigate = useNavigate();

    const LoginClick = () => {
        navigate('/login');
    };

    const RegistrarClick = () => {
        navigate('/registrar');
    };

    return (
        <div>
            <div>Inicio</div>
            <div>
                <button onClick={LoginClick}>Iniciar Sesión</button>
            </div>
            <div>
                <button onClick={RegistrarClick}>Registrarse</button>
            </div>
        </div>
    );
};
