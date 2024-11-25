import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import "../Styles/Home.css";

export const Home = () => {
  const [tasks, setTasks] = useState([]);

  const addPage = () => {
    const newTask = {
      id: Date.now(),
      name: "",
      etiquetas: "",
      estado: "Sin empezar",
      personas: "",
      progreso: 0,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="container">
      <div className="header">Ejemplo 02</div>
      <DynamicTable tasks={tasks} setTasks={setTasks} />
      
    </div>
  );
};

export default Home;
