import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskRow({ tarea, index, abrirEditar, eliminarTarea }) {
  const createdDate = new Date(tarea.created_at);
  const dueDate = new Date(tarea.due_date);
  const diffTime = Math.abs(dueDate - createdDate);
  const daysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const today = new Date();
  const diffRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  const daysRemaining = diffRemaining > 0 ? diffRemaining : 0;

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "completada":
      case "completado":
        return "success";
      case "en progreso":
      case "progreso":
        return "warning";
      case "pendiente":
      default:
        return "secondary";
    }
  };

  const getDiasColor = (dias) => {
    if (dias <= 0) return "text-danger fw-bold";
    if (dias <= 3) return "text-danger fw-bold";
    if (dias <= 7) return "text-warning fw-bold";
    return "text-success fw-bold";
  };

  return (
    <Draggable draggableId={tarea.id.toString()} index={index}>
      {(provided) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            cursor: "grab",
            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
            transition: "all 0.2s ease",
          }}
        >
          <td className="text-center">{index + 1}</td>
          <td className="fw-semibold">{tarea.title}</td>
          <td>{tarea.description}</td>
          <td className="text-center">{createdDate.toLocaleDateString()}</td>
          <td style={{ padding: "12px", width: "110px" }} className="text-center">
            {tarea.due_date}
          </td>
          <td className="text-center">{tarea.created_by}</td>
          <td className="text-center">{tarea.assigned_to}</td>
          <td className="text-center">
            <span className={`badge bg-${getEstadoColor(tarea.deadline_status)}`}>
              {tarea.deadline_status || "Pendiente"}
            </span>
          </td>
          <td className="text-center">
            <div className="progress" style={{ height: "8px", borderRadius: "5px" }}>
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${tarea.progress_percentage}%` }}
              ></div>
            </div>
            <small>{tarea.progress_percentage}%</small>
          </td>
          <td className="text-center">{tarea.priority}</td>
          <td className="text-center">{daysTotal}</td>
          <td className={`text-center ${getDiasColor(daysRemaining)}`}>{daysRemaining}</td>
          <td className="text-center">
            <div className="d-flex">
              <button
                className="btn btn-sm btn-outline-warning me-2"
                onClick={() => abrirEditar(tarea)}
              >
                ✏️
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => eliminarTarea(tarea.id)}
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      )}
    </Draggable>
  );
}
