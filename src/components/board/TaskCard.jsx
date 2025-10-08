import React from "react";
import { Card, Badge, ProgressBar } from "react-bootstrap";
import { Draggable } from "@hello-pangea/dnd";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import "./boardStyles.css";

function TaskCard({ task, draggableId, index , onEdit, onDelete }) {
  
  // Colores de prioridad
  const priorityColors = {
    high: "danger",
    medium: "warning",
    low: "success",
  };

  return (
    <Draggable draggableId={draggableId.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="m-2 task-card shadow-sm" style={{ backgroundColor: "#1b1b1b9f", color: "#fff" }}>
            <Card.Body className="p-2">
              {/* Encabezado con título + acciones */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="mb-1" style={{ fontSize: "1rem", color: "#ffffff", fontStyle: "bold", borderBottom: "2px solid #ff7f11", paddingBottom: "3px" }}>
                    {task.title}
                  </Card.Title>
                  {task.description && (
                    <Card.Text className="mb-2" style={{ fontSize: "0.85em", color: "#ffffffbb", fontStyle: "italic" }}>
                      {task.description}
                    </Card.Text>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <PencilSquare
                    role="button"
                    className="text-primary btn-outline-primary"
                    color="#ffffff96"
                    size={18}
                    onClick={() => onEdit(task)}
                    title="Editar tarea"
                  />
                  <Trash
                    role="button"
                    className="text-danger"
                    color="#ff8011b0"
                    size={18}
                    onClick={() => onDelete(task)}
                    title="Eliminar tarea"
                  />
                </div>
              </div>

              {/* Info rápida */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="">
                  <strong className="task-card-title">Asignado:</strong> {task.assigned_to}
                </small>
                <Badge bg={priorityColors[task.priority] || "secondary"}>
                  {task.priority}
                </Badge>
              </div>

              {/* Fecha límite */}
              <small className="d-block mb-2">
                <strong className="task-card-title">Fecha límite:</strong> {task.due_date}
              </small>

              {/* Barra de progreso */}
              <ProgressBar
              className="bg-dark"
                now={task.progress_percentage}
                label={`${task.progress_percentage}%`}
                variant="warning"
                style={{ height: "10px"  }}
              />
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
