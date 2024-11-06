import React from 'react';
import '../Styles/Home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <h2 className="home-title">Gestión de Actividades</h2>
            <div className="activity-card">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre de la Actividad</th>
                            <th>Asignado a</th>
                            <th>Estado</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="card">1</td>
                            <td className="card">Mantenimiento de maquinaria</td>
                            <td className="card">Juan Pérez</td>
                            <td className="card estado-en-progreso">En progreso</td>
                            <td className="card">2024-11-01</td>
                            <td className="card">2024-11-15</td>
                        </tr>
                        <tr>
                            <td className="card">2</td>
                            <td className="card">Optimización de línea de producción</td>
                            <td className="card">María López</td>
                            <td className="card estado-pendiente">Pendiente</td>
                            <td className="card">2024-11-05</td>
                            <td className="card">2024-12-01</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
