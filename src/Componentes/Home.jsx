import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Doughnut } from 'react-chartjs-2';
import '../Styles/Home.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const serializeRows = (rows) => {
    return rows.map(row => ({
        ...row,
        fechaInicio: row.fechaInicio instanceof Date ? row.fechaInicio.toISOString() : row.fechaInicio,
        fechaFin: row.fechaFin instanceof Date ? row.fechaFin.toISOString() : row.fechaFin
    }));
};

const deserializeRows = (rows) => {
    return rows.map(row => ({
        ...row,
        fechaInicio: row.fechaInicio ? new Date(row.fechaInicio) : null,
        fechaFin: row.fechaFin ? new Date(row.fechaFin) : null
    }));
};

export const Home = () => {
    const initialRows = deserializeRows(JSON.parse(localStorage.getItem('rows')) || []);
    const [rows, setRows] = useState(initialRows);

    const estadoOptions = [
        { label: 'No iniciado', value: 'No iniciado' },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Realizado', value: 'Realizado' }
    ];

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(serializeRows(rows)));
    }, [rows]);

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        const newRow = { nombre: "", progreso: 0, fechaInicio: null, fechaFin: null, estado: "No iniciado", persona: "" };
        setRows([...rows, newRow]);
    };

    const renderProgress = (rowData, rowIndex) => {
        const data = {
            datasets: [
                {
                    data: [rowData.progreso, 100 - rowData.progreso],
                    backgroundColor: ['#4caf50', '#e0e0e0'], // Verde para progreso, gris para restante
                    borderWidth: 0, // Sin borde alrededor del gráfico
                },
            ],
        };
        const options = {
            cutout: '80%', // Hace el centro de la dona más grande
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // Oculta la leyenda
                },
                tooltip: {
                    enabled: false, // Desactiva el tooltip
                },
            },
        };

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <span style={{ fontSize: '14px', color: '#4caf50', fontWeight: 'bold', marginRight: '5px' }}>
                    {rowData.progreso}%
                </span>
                <div style={{ width: '30px', height: '30px' }}> {/* Tamaño reducido del gráfico */}
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2>Gestión de Actividades</h2>
            <DataTable value={rows} responsiveLayout="scroll" className="custom-table">
                <Column header="Nombre" body={(rowData, { rowIndex }) => (
                    <InputText 
                        value={rowData.nombre} 
                        onChange={(e) => handleInputChange(rowIndex, 'nombre', e.target.value)} 
                    />
                )} />
                
                <Column header="Progreso (%)" body={(rowData, { rowIndex }) => (
                    renderProgress(rowData, rowIndex)
                )} />

                <Column header="Fecha de Inicio" body={(rowData, { rowIndex }) => (
                    <Calendar 
                        value={rowData.fechaInicio} 
                        onChange={(e) => handleInputChange(rowIndex, 'fechaInicio', e.value)} 
                        dateFormat="dd/mm/yy"
                        showIcon 
                    />
                )} />

                <Column header="Fecha de Fin" body={(rowData, { rowIndex }) => (
                    <Calendar 
                        value={rowData.fechaFin} 
                        onChange={(e) => handleInputChange(rowIndex, 'fechaFin', e.value)} 
                        dateFormat="dd/mm/yy"
                        showIcon 
                    />
                )} />
                
                <Column header="Estado" body={(rowData, { rowIndex }) => (
                    <Dropdown 
                        value={rowData.estado} 
                        options={estadoOptions} 
                        onChange={(e) => handleInputChange(rowIndex, 'estado', e.value)} 
                        placeholder="Seleccione Estado"
                    />
                )} />
                
                <Column header="Persona" body={(rowData, { rowIndex }) => (
                    <InputText 
                        value={rowData.persona} 
                        onChange={(e) => handleInputChange(rowIndex, 'persona', e.target.value)} 
                    />
                )} />
            </DataTable>
            <Button label="Agregar Fila" icon="pi pi-plus" onClick={addRow} className="custom-button mt-3" />
        </div>
    );
};

export default Home;

