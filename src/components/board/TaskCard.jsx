import React from "react";
import { Card } from "react-bootstrap";
import { Draggable } from "@hello-pangea/dnd";

function TaskCard({ task, draggableId, index }) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="m-1 shadow-sm bg-dark text-white fw-bold">
            <Card.Body>
              <Card.Text>
                {task.title}
                {task.description && (
                  <div className="text-white" style={{ fontSize: '0.85em' }}>
                    {task.description}
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
