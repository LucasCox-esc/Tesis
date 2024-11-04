import React from 'react';
import '../Styles/Home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <h2>Gestión de Actividades</h2>
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
                        <td>1</td>
                        <td>Mantenimiento de maquinaria</td>
                        <td>Juan Pérez</td>
                        <td>En progreso</td>
                        <td>2024-11-01</td>
                        <td>2024-11-15</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Optimización de línea de producción</td>
                        <td>María López</td>
                        <td>Pendiente</td>
                        <td>2024-11-05</td>
                        <td>2024-12-01</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
