import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddColumnButton from "./AddColumnButton";
import ContextMenu from "./ContextMenu";
import "../Styles/DynamicTable.css";

const DynamicTable = ({ tasks, setTasks }) => {
  const [columns, setColumns] = useState([
    { id: "name", label: "Nombre", editable: false, type: "text" },
    { id: "estado", label: "Estado", editable: true, type: "status" },
    { id: "personas", label: "Personas", editable: true, type: "person" },
    { id: "progreso", label: "Progreso", editable: true, type: "number" },
  ]);
  const [expanded, setExpanded] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [tempCellValue, setTempCellValue] = useState("");
  const [editingColumn, setEditingColumn] = useState(null); // Controla la columna en ediciÃ³n
  const [tempColumnName, setTempColumnName] = useState(""); // Valor temporal de la columna
  const [contextMenu, setContextMenu] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;

    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(source.index, 1);
    reorderedColumns.splice(destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
  };

  const addNewColumn = (type, label) => {
    const newColumnId = `column-${Date.now()}`;
    setColumns((prev) => [
      ...prev,
      { id: newColumnId, label, editable: true, type },
    ]);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCellEdit = (taskId, columnId, newValue) => {
    const updateTasks = (taskList) =>
      taskList.map((task) => {
        if (task.id === taskId) {
          return { ...task, [columnId]: newValue };
        }
        return { ...task, subtasks: updateTasks(task.subtasks) };
      });
    setTasks(updateTasks(tasks));
    setEditingCell(null);
  };

  const handleColumnEdit = (columnId, newLabel) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, label: newLabel } : col
      )
    );
    setEditingColumn(null);
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: "",
      estado: "Sin empezar",
      personas: "",
      progreso: 0,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setEditingCell({ taskId: newTask.id, columnId: "name" });
    setTempCellValue("");
  };

  const addSubtask = (parentId) => {
    const newSubtask = {
      id: Date.now(),
      name: "",
      estado: "Sin empezar",
      personas: "",
      progreso: 0,
      subtasks: [],
    };
    const updateTasks = (taskList) =>
      taskList.map((task) => {
        if (task.id === parentId) {
          return { ...task, subtasks: [...task.subtasks, newSubtask] };
        }
        return { ...task, subtasks: updateTasks(task.subtasks) };
      });
    setTasks(updateTasks(tasks));
    setEditingCell({ taskId: newSubtask.id, columnId: "name" });
    setTempCellValue("");
  };

  const handleContextMenu = (event, task) => {
    event.preventDefault();
    setContextMenu({
      position: { x: event.pageX, y: event.pageY },
      task,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextAction = (action, task) => {
    if (action === "Eliminar") {
      const deleteTask = (taskList) =>
        taskList
          .filter((t) => t.id !== task.id)
          .map((t) => ({ ...t, subtasks: deleteTask(t.subtasks) }));
      setTasks(deleteTask(tasks));
    }
    closeContextMenu();
  };

  const renderRows = (taskList, level = 0) => {
    return taskList.map((task) => (
      <React.Fragment key={task.id}>
        <tr
          onContextMenu={(e) => handleContextMenu(e, task)}
        >
          {columns.map((column) => (
            <td
              key={column.id}
              style={{
                paddingLeft: column.id === "name" ? `${20 * level}px` : "0",
              }}
              onDoubleClick={() => {
                setEditingCell({ taskId: task.id, columnId: column.id });
                setTempCellValue(task[column.id] || "");
              }}
            >
              {editingCell?.taskId === task.id &&
              editingCell?.columnId === column.id ? (
                <input
                  type="text"
                  value={tempCellValue}
                  onChange={(e) => setTempCellValue(e.target.value)}
                  onBlur={() =>
                    handleCellEdit(task.id, column.id, tempCellValue)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCellEdit(task.id, column.id, tempCellValue);
                    }
                  }}
                  autoFocus
                />
              ) : column.id === "name" ? (
                <>
                  <span
                    className={`caret ${
                      expanded.includes(task.id) ? "caret-down" : "caret-right"
                    }`}
                    onClick={() => toggleExpand(task.id)}
                  ></span>
                  {task[column.id] || "Nueva tarea"}
                </>
              ) : (
                task[column.id] || "-"
              )}
            </td>
          ))}
        </tr>
        {expanded.includes(task.id) && (
          <>
            {renderRows(task.subtasks, level + 1)}
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  paddingLeft: `${20 * (level + 1)}px`,
                  color: "#3b82f6",
                  cursor: "pointer",
                }}
                onClick={() => addSubtask(task.id)}
              >
                + Nueva subtarea
              </td>
            </tr>
          </>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <table
              className="table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={index}
                    >
                      {(provided) => (
                        <th
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="table-header"
                          onDoubleClick={() => {
                            setEditingColumn(column.id);
                            setTempColumnName(column.label);
                          }}
                        >
                          {editingColumn === column.id ? (
                            <input
                              type="text"
                              value={tempColumnName}
                              onChange={(e) =>
                                setTempColumnName(e.target.value)
                              }
                              onBlur={() =>
                                handleColumnEdit(column.id, tempColumnName)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleColumnEdit(column.id, tempColumnName);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            column.label
                          )}
                        </th>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <th>
                    <AddColumnButton onAddColumn={addNewColumn} />
                  </th>
                </tr>
              </thead>
              <tbody>{renderRows(tasks)}</tbody>
            </table>
          )}
        </Droppable>
        <button onClick={addTask} className="add-task-button" style={{backgroundColor: "#3B82F6", border:"none", borderRadius: "2px", color: "white",padding:"5px", marginTop:"20px"}}>
        + Nueva tarea
      </button>
      </DragDropContext>
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          actions={[
            { label: "Editar", onClick: () => console.log("Editar") },
            {
              label: "Eliminar",
              onClick: () =>
                handleContextAction("Eliminar", contextMenu.task),
            },
          ]}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default DynamicTable;