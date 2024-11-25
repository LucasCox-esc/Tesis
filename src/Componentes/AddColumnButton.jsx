import React, { useState, useEffect, useRef } from "react";
import "../Styles/AddColumnButton.css";

const AddColumnButton = ({ onAddColumn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const columnTypes = [
    { id: "text", label: "Texto" },
    { id: "number", label: "Número" },
    { id: "status", label: "Estado" },
    { id: "person", label: "Persona" },
    { id: "date", label: "Fecha" },
    { id: "checkbox", label: "Casilla" },
  ];

  // Cierra el menú si se hace clic fuera
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="add-column-wrapper" ref={menuRef}>
      <button
        className="add-column-button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        +
      </button>
      {isMenuOpen && (
        <div className="add-column-menu">
          {columnTypes.map((type) => (
            <div
              key={type.id}
              className="add-column-option"
              onClick={() => {
                onAddColumn(type.id, type.label); // Envía el tipo y el nombre al componente padre
                setIsMenuOpen(false);
              }}
            >
              {type.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddColumnButton;
