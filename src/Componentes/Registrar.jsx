import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Registrar = () => {
    const navigate = useNavigate();

    const LoginClick = () => {
        navigate('/login');
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: "column", width: "25%" }}>
                <div>Registrar</div>
                <input type="text" placeholder="Nombres" />
                <input type="text" placeholder="Apellidos" />
                <input type="text" placeholder="DNI" />
                <input type="email" placeholder="Correo" />
                <input type="password" placeholder="Contraseña" />
                <input type="password" placeholder="Confirmar Contraseña" />
            </div>
            <div>
                <button onClick={LoginClick}>Registrar</button>
            </div>
        </div>

    );
};
