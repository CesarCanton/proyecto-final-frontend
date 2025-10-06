import React from "react";
import TaskCard from "./TaskCard";
import { Card } from "react-bootstrap";
import { Droppable } from "@hello-pangea/dnd";

function Column({ id, name, tasks, onEditTask, onDeleteTask, dragHandleProps }) {
  return (
    <Card className="p-2 shadow-sm">
      <Card.Body>
        {/* capacidad para mover la columna deshabilitada */}
        {/* <Card.Title {...dragHandleProps} */}
<Card.Title
style={{
      cursor: "grab",
      padding: "8px 12px",
      marginBottom: "12px",
      borderRadius: "6px",
      fontWeight: "bold",
      zIndex: 2,
      position: "relative"
    }}
        >{name}</Card.Title>
        <Droppable droppableId={id.toString()} type="task">
          {(dropProvided) => (
            <div
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              style={{
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {tasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggableId={task.id.toString()} // <-- asegúrate que sea string
                  index={idx}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </Card.Body>
    </Card>
  );
}

export default Column;
// filepath: c:\Users\cesar\OneDrive\Desktop\Proyecto\src\components\board\Column.jsx