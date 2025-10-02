import React from "react";
import TaskCard from "./TaskCard";
import { Card } from "react-bootstrap";
import { Droppable } from "@hello-pangea/dnd";

function Column({ id, title, tasks }) {
  return (
    <Card
      className="p-2 shadow-sm "
      style={{
        flex: "0 0 auto",
        minWidth: tasks.length === 0 ? "fit-content" : "280px",
        maxWidth: "300px",
      }}
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Droppable droppableId={id} type="task">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
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
