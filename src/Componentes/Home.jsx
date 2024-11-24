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
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState(['Nombre', 'Etiquetas', 'Estado']);
    const navigate = useNavigate();

    // Función para agregar una nueva tarea
    const addTask = () => {
        const newTask = {
            id: Date.now(),
            name: 'Nueva Tarea',
            subtasks: [],
            labels: { Etiquetas: '', Estado: 'Pendiente' }
        };
        setTasks([...tasks, newTask]);
    };

    // Función para agregar una subtarea
    const addSubtask = (parentTaskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === parentTaskId) {
                const newSubtask = {
                    id: Date.now(),
                    name: 'Nueva Subtarea',
                    labels: { Etiquetas: '', Estado: 'Pendiente' }
                };
                return {
                    ...task,
                    subtasks: [...(task.subtasks || []), newSubtask]
                };
            }
            if (task.subtasks?.length) {
                return {
                    ...task,
                    subtasks: addSubtaskRecursive(task.subtasks, parentTaskId)
                };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const addSubtaskRecursive = (subtasks, parentTaskId) =>
        subtasks.map((subtask) => {
            if (subtask.id === parentTaskId) {
                return {
                    ...subtask,
                    subtasks: [
                        ...(subtask.subtasks || []),
                        {
                            id: Date.now(),
                            name: 'Nueva Subtarea',
                            labels: { Etiquetas: '', Estado: 'Pendiente' }
                        }
                    ]
                };
            }
            if (subtask.subtasks?.length) {
                return {
                    ...subtask,
                    subtasks: addSubtaskRecursive(subtask.subtasks, parentTaskId)
                };
            }
            return subtask;
        });

    // Función para agregar una columna dinámica
    const addColumn = () => {
        const columnName = prompt('Ingrese el nombre de la nueva columna:');
        if (columnName) {
            setColumns([...columns, columnName]);
        }
    };

    // Renderizar tareas y subtareas con la opción de agregar subtarea al nivel correspondiente
    const renderTaskRows = (taskList, level = 0) => {
        return taskList.flatMap((task) => {
            return [
                <tr key={`task-${task.id}`} className={`task-row subtask-level-${level}`}>
                    {columns.map((col, index) => (
                        <td key={`${task.id}-${col}`}>
                            {col === 'Nombre' && (
                                <input
                                    type="text"
                                    value={task.name}
                                    onChange={(e) => (task.id, 'name', e.target.value)}
                                    className="editable-input"
                                />
                            )}
                            {col !== 'Nombre' && (
                                <input
                                    type="text"
                                    value={task.labels[col] || ''}
                                    onChange={(e) => (task.id, col, e.target.value)}
                                    className="editable-input"
                                />
                            )}
                        </td>
                    ))}
                </tr>,
                ...(task.subtasks?.length
                    ? renderTaskRows(task.subtasks, level + 1)
                    : []),
                <tr key={`add-subtask-${task.id}`} className={`add-subtask-row subtask-level-${level}`}>
                    <td colSpan={columns.length}>
                        <div>
                            <Button
                                label="Agregar Subtarea"
                                icon="pi pi-plus"
                                className="p-button-text p-button-sm"
                                onClick={() => addSubtask(task.id)}
                            />
                        </div>
                    </td>
                </tr>
            ];
        });
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/inicio');
    };

    return (
        <div style={{ overflowY: 'auto' }}>
            <div style={{ display: 'flex' }}>
                {/* Menú lateral */}
                <SidebarMenu />

                {/* Contenido principal */}
                <div style={{ padding: '5px', width: '100%', overflowX: 'auto' }}>
                    <BackgroundRectangle />
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="custom-input-text"
                            type="text"
                            placeholder="Añada su Título"
                        />
                    </div>

                    <table className="task-table">
                        <thead>
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={col}>
                                        {col}
                                        {index === columns.length - 1 && (
                                            <Button
                                                icon="pi pi-plus"
                                                className="p-button-rounded p-button-sm p-button-secondary"
                                                onClick={addColumn}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={columns.length}>
                                    <Button
                                        label="Agregar Tarea"
                                        icon="pi pi-plus"
                                        className="p-button-outlined p-button-sm"
                                        onClick={addTask}
                                    />
                                </td>
                            </tr>
                            {renderTaskRows(tasks)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
