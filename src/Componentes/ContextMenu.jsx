import React from "react";
import "../Styles/ContextMenu.css";

const ContextMenu = ({ position, actions, onClose }) => {
  return (
    <div
      className="context-menu"
      style={{
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action, index) => (
        <div
          key={index}
          className="context-menu-item"
          onClick={() => {
            action.onClick();
            onClose(); // Cerrar el menú al hacer clic en una acción
          }}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
