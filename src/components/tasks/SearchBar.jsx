import React from "react";

export default function SearchBar({ busqueda, onBuscar, onAgregar }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
      <input
        type="text"
        className="form-control shadow-sm"
        style={{ borderRadius: "10px", padding: "10px 15px" }}
        placeholder="Buscar tarea por nombre..."
        value={busqueda}
        onChange={(e) => onBuscar(e.target.value)}
      />
      <button
        className="btn btn-success shadow-sm px-4 py-2 btn-agregar-responsive"
        style={{ borderRadius: "8px" }}
        onClick={onAgregar}
      >
        + Agregar Tarea
      </button>
    </div>
  );
}
