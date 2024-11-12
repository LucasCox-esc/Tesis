import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
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
    const [columns, setColumns] = useState(
        JSON.parse(localStorage.getItem('columns')) || [
            { field: 'nombre', header: 'Nombre', editor: 'InputText', isEditable: false, backgroundColor: '#ffffff' },
            { field: 'progreso', header: 'Progreso (%)', editor: 'InputNumber', isEditable: false, backgroundColor: '#ffffff' },
            { field: 'fechaInicio', header: 'Fecha de Inicio', editor: 'Calendar', isEditable: false, backgroundColor: '#ffffff' },
            { field: 'fechaFin', header: 'Fecha de Fin', editor: 'Calendar', isEditable: false, backgroundColor: '#ffffff' },
            { field: 'estado', header: 'Estado', editor: 'Dropdown', isEditable: false, backgroundColor: '#ffffff' },
            { field: 'persona', header: 'Persona', editor: 'InputText', isEditable: false, backgroundColor: '#ffffff' }
        ]
    );
    const [selectedColumn, setSelectedColumn] = useState(null);
    const contextMenu = React.useRef(null);

    const estadoOptions = [
        { label: 'No iniciado', value: 'No iniciado' },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Realizado', value: 'Realizado' }
    ];

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(serializeRows(rows)));
        localStorage.setItem('columns', JSON.stringify(columns));
    }, [rows, columns]);

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const handleColumnNameChange = (index, value) => {
        const updatedColumns = [...columns];
        updatedColumns[index].header = value;
        setColumns(updatedColumns);
    };

    const addRow = () => {
        const newRow = { nombre: "", progreso: 0, fechaInicio: null, fechaFin: null, estado: "No iniciado", persona: "" };
        setRows([...rows, newRow]);
    };

    const addColumn = () => {
        const newField = `campoExtra${columns.length - 5}`;
        setColumns([
            ...columns,
            { field: newField, header: `Extra ${columns.length - 5}`, editor: 'InputText', isEditable: true, backgroundColor: '#ffffff' }
        ]);
        setRows(rows.map(row => ({ ...row, [newField]: '' })));
    };

    const removeColumn = (field) => {
        setColumns(columns.filter(col => col.field !== field));
        setRows(rows.map(row => {
            const updatedRow = { ...row };
            delete updatedRow[field];
            return updatedRow;
        }));
    };

    const changeColumnColor = (field, color) => {
        setColumns(columns.map(col => col.field === field ? { ...col, backgroundColor: color } : col));
    };

    const renderProgress = (rowData, rowIndex) => {
        const data = {
            datasets: [
                {
                    data: [rowData.progreso, 100 - rowData.progreso],
                    backgroundColor: ['#4caf50', '#e0e0e0'],
                    borderWidth: 0,
                },
            ],
        };
        const options = {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
        };

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <InputNumber 
                    value={rowData.progreso} 
                    onValueChange={(e) => handleInputChange(rowIndex, 'progreso', e.value)} 
                    suffix="%" 
                    showButtons 
                    min={0} 
                    max={100} 
                    style={{ width: '60px', marginRight: '10px' }}
                />
                <div style={{ width: '30px', height: '30px' }}>
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        );
    };

    const renderCell = (rowData, rowIndex, col) => {
        switch (col.editor) {
            case 'InputText':
                return (
                    <div
                        onContextMenu={(e) => {
                            if (col.isEditable) {
                                e.preventDefault();
                                setSelectedColumn(col);
                                contextMenu.current.show(e);
                            }
                        }}
                        style={{ backgroundColor: col.backgroundColor }}
                    >
                        <InputText 
                            value={rowData[col.field]} 
                            onChange={(e) => handleInputChange(rowIndex, col.field, e.target.value)} 
                        />
                    </div>
                );
            case 'InputNumber':
                return col.field === 'progreso' ? renderProgress(rowData, rowIndex) : (
                    <div
                        onContextMenu={(e) => {
                            if (col.isEditable) {
                                e.preventDefault();
                                setSelectedColumn(col);
                                contextMenu.current.show(e);
                            }
                        }}
                        style={{ backgroundColor: col.backgroundColor }}
                    >
                        <InputNumber 
                            value={rowData[col.field]} 
                            onValueChange={(e) => handleInputChange(rowIndex, col.field, e.value)} 
                        />
                    </div>
                );
            case 'Calendar':
                return (
                    <Calendar 
                        value={rowData[col.field]} 
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)} 
                        dateFormat="dd/mm/yy" 
                        showIcon 
                    />
                );
            case 'Dropdown':
                return (
                    <Dropdown 
                        value={rowData[col.field]} 
                        options={estadoOptions} 
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)} 
                        placeholder="Seleccione Estado" 
                    />
                );
            default:
                return null;
        }
    };

    const menuItems = [
        {
            label: 'Eliminar columna',
            command: () => selectedColumn && removeColumn(selectedColumn.field)
        },
        {
            label: 'Cambiar color a rojo',
            command: () => selectedColumn && changeColumnColor(selectedColumn.field, '#ff4d4d')
        },
        {
            label: 'Cambiar color a azul',
            command: () => selectedColumn && changeColumnColor(selectedColumn.field, '#4d79ff')
        },
        {
            label: 'Cambiar color a verde',
            command: () => selectedColumn && changeColumnColor(selectedColumn.field, '#4dff88')
        }
    ];

    return (
        <div>
            <h2>Gestión de Actividades</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <Button label="Agregar Fila" icon="pi pi-plus" onClick={addRow} className="custom-button" />
                <Button label="Agregar Columna" icon="pi pi-plus" onClick={addColumn} className="custom-button" />
            </div>
            <ContextMenu model={menuItems} ref={contextMenu} />
            <DataTable value={rows} responsiveLayout="scroll" className="custom-table">
                {columns.map((col, index) => (
                    <Column 
                        key={index} 
                        header={
                            <div
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    if (col.isEditable) {
                                        setSelectedColumn(col);
                                        contextMenu.current.show(e);
                                    }
                                }}
                                style={{ backgroundColor: col.backgroundColor }}
                            >
                                {col.isEditable ? (
                                    <InputText 
                                        value={col.header} 
                                        onChange={(e) => handleColumnNameChange(index, e.target.value)} 
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    col.header
                                )}
                            </div>
                        }
                        body={(rowData, { rowIndex }) => renderCell(rowData, rowIndex, col)}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default Home;
