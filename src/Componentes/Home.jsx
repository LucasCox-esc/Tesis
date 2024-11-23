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
    const [backgroundImage, setBackgroundImage] = useState(null); // Fondo del rectángulo gris oscuro
    const [circleImage, setCircleImage] = useState(null); // Fondo del círculo
    const circleInputRef = useRef(null); // Referencia para el input del círculo
    const handleCircleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCircleImage(reader.result); // Cambiar el fondo del círculo
            };
            reader.readAsDataURL(file);
        }
    };
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
    const fileInputRef = useRef(null); // Referencia para el input de archivo

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
            <div style={{ position: 'relative', display: 'inline-block', width: "50px" }}>
                <InputNumber
                    value={rowData.progreso}
                    onValueChange={(e) => handleInputChange(rowIndex, 'progreso', e.value)}
                    suffix="%"
                    style={{ width: '10px', fontSize: '12px' }} // Ajuste para reducir el ancho del input
                    className="custom-input"
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '13%',
                        left: '60px',
                        transform: 'translateY(-50%)',
                        transform: 'translateX(310%)',
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
                        style={{ width: '200px', marginLeft: "20px" }}
                        className="custom-calendar"
                    />
                ) : col.editor === 'Dropdown' ? (
                    <Dropdown
                        value={rowData[col.field]}
                        options={estadoOptions}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        placeholder="Seleccione Estado"
                        style={{ width: '200px' }}
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
                setBackgroundImage(reader.result); // Cambiar el fondo del rectángulo
            };
            reader.readAsDataURL(file);
        }
    };
    const rowContextMenuModel = [
        { label: 'Eliminar fila', command: () => removeRow(selectedRow) },
        { label: 'Eliminar columna', command: () => removeColumn(selectedColumn?.field) },
    ];

    return (
        <div style={{ overflowY: 'auto' }}>
            {/* MENU LATERAL */}
            <div style={{ display: 'flex' }}>
                {/* Menú lateral */}
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

                {/* Contenido principal */}
                <div style={{ marginLeft: '250px', padding: '20px', width: "100%", overflowX: 'auto' }}>
                    {/* Rectángulo gris oscuro con fondo dinámico */}
                    <div
                        style={{
                            backgroundColor: "#333",
                            width: "100%",
                            height: "35vh",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${backgroundImage})`,
                            position: 'relative',
                        }}
                    >
                        {/* Botón para cambiar el fondo del rectángulo */}
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-secondary"
                            aria-label="Cambiar fondo del rectángulo"
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                            }}
                        />
                        {/* Input de archivo oculto para el rectángulo */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleBackgroundImageChange}
                        />

                        {/* Círculo en la esquina inferior izquierda con fondo dinámico */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '10px',
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid white',
                                backgroundColor: 'white',
                            }}
                        >
                            {circleImage && (
                                <img
                                    src={circleImage}
                                    alt="Fondo del círculo"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            {/* Botón para cambiar el fondo del círculo */}
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-secondary"
                                aria-label="Cambiar fondo del círculo"
                                onClick={() => circleInputRef.current.click()}
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                }}
                            />
                            {/* Input de archivo oculto para el círculo */}
                            <input
                                ref={circleInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleCircleImageChange}
                            />
                        </div>
                        {/* Input de archivo oculto */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleBackgroundImageChange}
                        />
                    </div>
                    <div style={{ marginBottom: '-60px' }}>
                        <InputText
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="custom-input-text"
                            type="text"
                            placeholder={pageTitle === '' ? 'Añada su Título' : ''}
                        />

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <Button label="" icon="pi pi-plus" onClick={addColumn} />
                    </div>
                    <div style={{overflowY:'auto', maxHeight:'600px'}}>
                        <div style={{ overflowX: 'auto', overflowY: 'auto' }}>
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
                                        header={renderHeader(col)}
                                        body={(rowData, { rowIndex }) => renderCell(rowData, rowIndex, col)}
                                        headerStyle={{ backgroundColor: '#007AFF', color: '#ddd' }}
                                        style={{ minWidth: '200px' }}
                                    />
                                ))}
                            </DataTable>
                        </div>
                        <ContextMenu model={rowContextMenuModel} ref={rowContextMenu} />
                        <Button
                            label=""
                            icon="pi pi-plus"
                            onClick={addRow}
                            style={{ marginTop: '10px', marginLeft: '10px' }}
                        />
                    </div>


                </div>
            </div>
        </div>
    );
};
