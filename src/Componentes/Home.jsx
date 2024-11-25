import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import "../Styles/Home.css";
import SidebarMenu from "./SidebarMenu";
import BackgroundRectangle from "./BackgroundRectangle";

export const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [pageTitle, setPageTitle] = useState('Gestión de Tareas');
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
        <div>
            <div style={{ display: "flex" }}>
                <div>
                    <SidebarMenu />
                </div>
                <div style={{ width: "100%" }}>
                    <div style={{ margin: "15px" }}>
                        <BackgroundRectangle />
                    </div>

                    <div style={{ margin: "55px" }}>
                        <input
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="custom-input-text"
                            type="text"
                            placeholder={pageTitle === '' ? 'Añada su Título' : ''}
                        />
                        <DynamicTable tasks={tasks} setTasks={setTasks} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
