import React from "react";
import TaskCard from "./TaskCard";
import { Card } from "react-bootstrap";
import { Droppable } from "@hello-pangea/dnd";

function Column({ id, title, tasks, dragHandleProps }) {
  return (
    <Card className="p-3 shadow-sm vh-100">
      <Card.Body>
        {/* Handler para mover la columna */}
        <Card.Title {...dragHandleProps}>{title}</Card.Title>

        {/* Droppable para las tareas */}
        <Droppable droppableId={id} type="task">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: "100px" }} // asegura espacio aunque esté vacío
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggableId={task.id}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card.Body>
    </Card>
  );
}

export default Column;
