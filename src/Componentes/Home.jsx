import React, { useState, useEffect, useRef } from 'react';
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
    const [pageTitle, setPageTitle] = useState('Gestión de Tareas');
    const [rows, setRows] = useState(deserializeRows(JSON.parse(localStorage.getItem('rows')) || []));
    const [columns, setColumns] = useState(
        JSON.parse(localStorage.getItem('columns')) || [
            { field: 'nombre', header: 'Nombre', editor: 'InputText', isEditable: false },
            { field: 'progreso', header: 'Progreso (%)', editor: 'InputNumber', isEditable: false },
            { field: 'fechaInicio', header: 'Fecha de Inicio', editor: 'Calendar', isEditable: false },
            { field: 'fechaFin', header: 'Fecha de Fin', editor: 'Calendar', isEditable: false },
            { field: 'estado', header: 'Estado', editor: 'Dropdown', isEditable: false },
            { field: 'persona', header: 'Persona', editor: 'InputText', isEditable: false }
        ]
    );
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const rowContextMenu = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

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

    const addRow = () => {
        const newRow = { nombre: "", progreso: 0, fechaInicio: null, fechaFin: null, estado: "No iniciado", persona: "" };
        setRows([...rows, newRow]);
    };

    const addColumn = () => {
        const newField = `extra${columns.length + 1}`;
        setColumns([
            ...columns,
            { field: newField, header: `Extra ${columns.length + 1}`, editor: 'InputText', isEditable: true }
        ]);
        setRows(rows.map(row => ({ ...row, [newField]: '' })));
    };

    const removeRow = (rowData) => {
        setRows(rows.filter(row => row !== rowData));
    };

    const removeColumn = (field) => {
        setColumns(columns.filter(col => col.field !== field));
        setRows(rows.map(row => {
            const updatedRow = { ...row };
            delete updatedRow[field];
            return updatedRow;
        }));
    };

    const handleHeaderChange = (col, value) => {
        setColumns(columns.map(column => column.field === col.field ? { ...column, header: value } : column));
    };

    const renderHeader = (col) => {
        return (
            <InputText
                value={col.header}
                onChange={(e) => handleHeaderChange(col, e.target.value)}
                style={{ width: '100%', fontWeight: 'bold', color: '#ddd', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}
            />
        );
    };

    const renderProgress = (rowData, rowIndex) => {
        const data = {
            datasets: [
                {
                    data: [rowData.progreso, 100 - rowData.progreso],
                    backgroundColor: ['green', '#b0b0b0'],
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
            <div style={{ position: 'relative', display: 'inline-block', width: "100px" }}>
                <InputNumber
                    value={rowData.progreso}
                    onValueChange={(e) => handleInputChange(rowIndex, 'progreso', e.value)}
                    suffix="%"
                    showButtons
                    min={0}
                    max={100}
                    className="custom-input"
                    style={{ width: '50px' }} // Reduce el ancho del input de progreso
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '60px',
                        transform: 'translateY(-50%)',
                        width: '30px',
                        height: '30px',
                        pointerEvents: 'none'
                    }}
                >
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        );
    };

    const renderCell = (rowData, rowIndex, col) => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            setSelectedRow(rowData);
            setSelectedColumn(col);
            if (rowContextMenu.current) {
                rowContextMenu.current.show(e);
            }
        };

        return (
            <div style={{ backgroundColor: 'transparent', padding: '8px' }} onContextMenu={handleContextMenu}>
                {col.editor === 'InputText' && (
                    <InputText
                        value={rowData[col.field]}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.target.value)}
                        className="custom-input"
                    />
                )}
                {col.editor === 'InputNumber' && col.field === 'progreso' ? (
                    renderProgress(rowData, rowIndex)
                ) : col.editor === 'InputNumber' ? (
                    <InputNumber
                        value={rowData[col.field]}
                        onValueChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        className="custom-input"
                    />
                ) : col.editor === 'Calendar' ? (
                    <Calendar
                        value={rowData[col.field]}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        style={{ width: '150px' }} // Ancho fijo para los calendarios
                        className="custom-calendar"
                    />
                ) : col.editor === 'Dropdown' ? (
                    <Dropdown
                        value={rowData[col.field]}
                        options={estadoOptions}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        placeholder="Seleccione Estado"
                        style={{ width: '150px' }} // Ancho fijo para el Dropdown
                        className="custom-dropdown"
                    />
                ) : null}
            </div>
        );
    };

    const handleBackgroundImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const rowContextMenuModel = [
        { label: 'Eliminar fila', command: () => removeRow(selectedRow) },
        { label: 'Eliminar columna', command: () => removeColumn(selectedColumn?.field) },
    ];

    return (
        <div style={{ display: 'flex' }}>
            <div style={{
                width: '250px',
                height: '100vh',
                backgroundColor: '#333',
                color: 'white',
                padding: '20px',
                position: 'fixed',
                top: 0,
                left: 0,
                boxSizing: 'border-box',
            }}>
                <h3>Menú</h3>
            </div>

            <div style={{ marginLeft: '250px', padding: '20px', maxHeight: '100vh', overflowY: 'auto', width: "100%" }}>
                <div
                    style={{
                        backgroundColor: "#333",
                        width: "100%",
                        height: "35vh",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${backgroundImage})`
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageChange}
                        style={{ position: 'absolute', top: 20 }}
                    />
                </div>
                <InputText
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    style={{ fontSize: '3.5em', fontWeight: 'bold', border: 'none', backgroundColor: 'transparent', color: '#444444' }}
                    type="text"
                    placeholder={pageTitle === '' ? 'Añada su Título' : ''}
                />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <Button label="" icon="pi pi-plus" onClick={addColumn} />
                </div>

                <DataTable
                    value={rows}
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    style={{ marginTop: '20px', backgroundColor: '#333' }}
                    contextMenuSelection={selectedRow}
                    onContextMenuSelectionChange={(e) => setSelectedRow(e.value)}
                >
                    {columns.map((col) => (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={renderHeader(col)} // Renderiza el encabezado editable por defecto
                            body={(rowData, { rowIndex }) => renderCell(rowData, rowIndex, col)}
                            headerStyle={{ backgroundColor: '#444', color: '#ddd' }}
                        />
                    ))}
                </DataTable>
                <ContextMenu model={rowContextMenuModel} ref={rowContextMenu} />
                <Button 
                    label="" 
                    icon="pi pi-plus" 
                    onClick={addRow} 
                    style={{ marginTop: '10px', marginLeft: '10px' }} // Posición del botón en la esquina inferior izquierda
                />
            </div>
        </div>
    );
};
