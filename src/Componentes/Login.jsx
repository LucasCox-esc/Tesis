// src/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const HomeClick = () => {
        navigate('/home');
    };
    return (
        <div>
            <h2>Login</h2>
            <p>Ingrese sus credenciales</p>
            <div style={{ display: 'flex', flexDirection: "column", width: "25%" }}>
                <input type="email" placeholder="Correo" />
                <input type="password" placeholder="Contraseña" />
            </div>
            <button onClick={HomeClick}>Iniciar Sesión</button>
        </div>
    );
};
