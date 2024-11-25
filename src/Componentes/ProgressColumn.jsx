import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressColumn = () => {
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    let value = parseInt(e.target.value, 10);
    value = isNaN(value) || value < 0 ? 0 : value > 100 ? 100 : value; // Limita a 0-100
    setProgress(value);
  };

  const data = {
    labels: ["Progreso", "Restante"],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        hoverBackgroundColor: ["#45A049", "#BDBDBD"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "190%", // Controla el grosor de la dona
    plugins: {
      legend: {
        display: false, // Oculta la leyenda para un diseño limpio
      },
    },
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="number"
        value={progress}
        onChange={handleChange}
        min="0"
        max="100"
        style={{ width: "60px", textAlign: "center" }}
      />
      <div style={{ width: "10px", height: "10px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressColumn;
