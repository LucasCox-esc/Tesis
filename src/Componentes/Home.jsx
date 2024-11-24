import React, { useState } from 'react';
import { Button } from 'primereact/button';
import '../Styles/Home.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import BackgroundRectangle from './BackgroundRectangle';
import SidebarMenu from './SidebarMenu';

export const Home = () => {
    const [pageTitle, setPageTitle] = useState('Gestión de Tareas');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token o cualquier dato del usuario
        navigate('/inicio'); // Redirige al inicio de sesión
    };

    return (
        <div style={{ overflowY: 'auto' }}>
            <div style={{ display: 'flex' }}>
                {/* Menú lateral */}
                <SidebarMenu />

                {/* Contenido principal */}
                <div style={{ padding: '20px', width: "100%", overflowX: 'auto' }}>
                    <BackgroundRectangle />
                    <div style={{ marginBottom: '-30px' }}>
                        <input
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="custom-input-text"
                            type="text"
                            placeholder="Añada su Título"
                            style={{
                                width: '100%',
                                fontSize: '24px',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
