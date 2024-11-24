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
import { useNavigate } from 'react-router-dom';
import BackgroundRectangle from './BackgroundRectangle';
import SidebarMenu from './SidebarMenu';
import { addLocale } from 'primereact/api';

Chart.register(ArcElement, Tooltip, Legend);
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],
    monthNamesShort: [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ],
    today: 'Hoy',
    clear: 'Limpiar'
});

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
    const navigate = useNavigate();

    const [rows, setRows] = useState(deserializeRows(JSON.parse(localStorage.getItem('rows')) || []));
    const [columns, setColumns] = useState(
        JSON.parse(localStorage.getItem('columns')) || [
            { field: 'nombre', header: 'Nombre', editor: 'InputText', isEditable: false },
            { field: 'progreso', header: 'Progreso (%)', editor: 'InputNumber', isEditable: false },
            { field: 'fechaInicio', header: 'Fecha de Inicio', editor: 'Calendar', isEditable: false },
            { field: 'fechaFin', header: 'Fecha de Fin', editor: 'Calendar', isEditable: false },
            { field: 'estado', header: 'Estado', editor: 'Dropdown', isEditable: false },
            { field: 'persona', header: 'Persona', editor: 'Dropdown', isEditable: false }
        ]
    );
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const rowContextMenu = useRef(null);

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
                    style={{ width: '10px', fontSize: '12px' }}
                    className="custom-input"
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '15%',
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

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token o cualquier dato del usuario
        navigate('/inicio'); // Redirige al inicio de sesión
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
                        style={{
                            height: '50px',
                            width: '100px',
                            padding: '4px',
                            fontSize: '20px',
                        }}
                    />
                )}
                {col.editor === 'InputNumber' && col.field === 'progreso' ? (
                    renderProgress(rowData, rowIndex)
                ) : col.editor === 'InputNumber' ? (
                    <InputNumber
                        value={rowData[col.field]}
                        onValueChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        className="custom-input"
                        style={{
                            height: '50px',
                            width: '50px',
                            padding: '4px',
                            fontSize: '20px',
                        }}
                    />
                ) : col.editor === 'Calendar' ? (
                    <Calendar
                        value={rowData[col.field]}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        locale="es"
                        className="custom-calendar"
                        style={{
                            fontSize: '20px', // Tamaño del texto
                        }}
                        inputStyle={{
                            textAlign: 'center', // Centra el texto del campo de entrada
                        }}
                    />

                ) : col.editor === 'Dropdown' && col.field === 'persona' ? (
                    <Dropdown
                        value={rowData[col.field]}
                        options={[
                            { label: 'Juan Pérez', value: 'Juan Pérez' },
                            { label: 'María López', value: 'María López' },
                            { label: 'Carlos Sánchez', value: 'Carlos Sánchez' }
                        ]}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        placeholder="Seleccione Persona"
                        style={{
                            width: '150px',
                            height: '50px',
                            fontSize: '20px',
                            lineHeight: '44px', // Centra verticalmente el texto
                            textAlign: 'center', // Alinea el texto al centro horizontal
                        }}
                        className="custom-dropdown"
                    />
                ) : col.editor === 'Dropdown' ? (
                    <Dropdown
                        value={rowData[col.field]}
                        options={[
                            { label: 'No iniciado', value: 'No iniciado' },
                            { label: 'En progreso', value: 'En progreso' },
                            { label: 'Realizado', value: 'Realizado' }
                        ]}
                        onChange={(e) => handleInputChange(rowIndex, col.field, e.value)}
                        placeholder="Seleccione Estado"
                        style={{
                            width: '150px',
                            height: '50px',
                            fontSize: '20px',
                            lineHeight: '44px', // Centra verticalmente el texto
                            textAlign: 'center', // Alinea el texto al centro horizontal
                        }}
                        className="custom-dropdown"
                    />
                ) : null}
            </div>

        );
    };
    const personaOptions = [
        { label: 'Juan Pérez', value: 'Juan Pérez' },
        { label: 'María López', value: 'María López' },
        { label: 'Carlos Sánchez', value: 'Carlos Sánchez' }
    ];
    const rowContextMenuModel = [
        { label: 'Eliminar fila', command: () => removeRow(selectedRow) },
        { label: 'Eliminar columna', command: () => removeColumn(selectedColumn?.field) },
    ];

    return (
        <div style={{ overflowY: 'auto' }}>
            <div style={{ display: 'flex' }}>
                {/* Menú lateral */}
                <SidebarMenu />

                {/* Contenido principal */}
                <div style={{ padding: '20px', width: "100%", overflowX: 'auto' }}>
                    <BackgroundRectangle />
                    <div style={{ marginBottom: '-30px' }}>
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
                    <div style={{ overflowY: 'auto', maxHeight: '600px' }}>
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
                                        headerStyle={{ backgroundColor: '#007AFF', color: '#ddd', height: '60px' }}
                                        style={{ minWidth: '200px' }}
                                    />
                                ))}
                            </DataTable>
                        </div>
                        <ContextMenu
                            model={rowContextMenuModel}
                            ref={rowContextMenu}
                            className="custom-context-menu"
                            style={{
                            }}
                        />
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