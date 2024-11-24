import React, { useState } from "react";

export const Prueba = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Revisión Final PIZZAS RAUL",
      progress: 0,
      date: "",
      status: "No iniciado",
      person: "",
      subtasks: [],
    },
  ]);

  const [taskCounter, setTaskCounter] = useState(2);

  // Agregar una nueva tarea
  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: taskCounter,
        name: `Nueva Tarea ${taskCounter}`,
        progress: 0,
        date: "",
        status: "No iniciado",
        person: "",
        subtasks: [],
      },
    ]);
    setTaskCounter(taskCounter + 1);
  };

  // Agregar una subtarea
  const addSubtask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: `${taskId}-${task.subtasks.length + 1}`,
                name: `Subtarea ${task.subtasks.length + 1}`,
                progress: 0,
                date: "",
                status: "No iniciado",
                person: "",
              },
            ],
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const renderTask = (task, level = 0) => (
    <React.Fragment key={task.id}>
      <tr>
        <td style={{ paddingLeft: `${level * 20}px` }}>{task.name}</td>
        <td>
          <input
            type="number"
            value={task.progress}
            onChange={(e) => updateTask(task.id, "progress", e.target.value)}
            style={{ width: "60px" }}
          />
        </td>
        <td>
          <input
            type="text"
            value={task.date}
            onChange={(e) => updateTask(task.id, "date", e.target.value)}
            placeholder="Fecha"
          />
        </td>
        <td>
          <select
            value={task.status}
            onChange={(e) => updateTask(task.id, "status", e.target.value)}
          >
            <option value="No iniciado">No iniciado</option>
            <option value="En progreso">En progreso</option>
            <option value="Realizado">Realizado</option>
            <option value="Parado">Parado</option>
          </select>
        </td>
        <td>
          <input
            type="text"
            value={task.person}
            onChange={(e) => updateTask(task.id, "person", e.target.value)}
            placeholder="Persona"
          />
        </td>
        <td>
          <button onClick={() => addSubtask(task.id)}>Agregar Subtarea</button>
        </td>
      </tr>
      {task.subtasks &&
        task.subtasks.map((subtask) => renderTask(subtask, level + 1))}
    </React.Fragment>
  );

  // Actualizar propiedades de las tareas
  const updateTask = (taskId, field, value) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          [field]: value,
        };
      }
      if (task.subtasks) {
        return {
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask.id === taskId ? { ...subtask, [field]: value } : subtask
          ),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h2>Gestión de Tareas</h2>
      <button onClick={addTask} style={{ marginBottom: "10px" }}>
        Agregar Tarea
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Nombre</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Progreso (%)</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Fecha</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Estado</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Persona</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>{tasks.map((task) => renderTask(task))}</tbody>
      </table>
    </div>
  );
};
