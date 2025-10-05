import React from "react";
import { Card, Badge, ProgressBar } from "react-bootstrap";
import { Draggable } from "@hello-pangea/dnd";
import { PencilSquare, Trash } from "react-bootstrap-icons";

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
          <Card className="m-2">
            <Card.Body className="p-2">
              {/* Encabezado con título + acciones */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title className="mb-1" style={{ fontSize: "1rem" }}>
                    {task.title}
                  </Card.Title>
                  {task.description && (
                    <Card.Text className="text-muted mb-2" style={{ fontSize: "0.85em" }}>
                      {task.description}
                    </Card.Text>
                  )}
                </div>
                <div>
                  <PencilSquare
                    role="button"
                    className="text-primary me-2"
                    size={18}
                    onClick={() => onEdit(task)}
                    title="Editar tarea"
                  />
                  <Trash
                    role="button"
                    className="text-danger"
                    size={18}
                    onClick={() => onDelete(task)}
                    title="Eliminar tarea"
                  />
                </div>
              </div>

              {/* Info rápida */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">
                  Asignado: <strong>{task.assigned_to}</strong>
                </small>
                <Badge bg={priorityColors[task.priority] || "secondary"}>
                  {task.priority}
                </Badge>
              </div>

              {/* Fecha límite */}
              <small className="d-block mb-2">
                <strong>Fecha límite:</strong> {task.due_date}
              </small>

              {/* Barra de progreso */}
              <ProgressBar
                now={task.progress_percentage}
                label={`${task.progress_percentage}%`}
                variant="info"
                style={{ height: "8px" }}
              />
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
