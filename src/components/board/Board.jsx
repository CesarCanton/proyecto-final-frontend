import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "../board/Column";
import NavbarComponent from "./Navbar";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./boardStyles.css";

const initialColumns = [
  { id: "todo", title: "Por hacer", taskIds: ["task-1", "task-2", "task-3"] },
  { id: "doing", title: "En progreso", taskIds: [] },
  { id: "review", title: "Revisión", taskIds: ["task-4"] },
];

const initialTasks = {
  "task-1": { id: "task-1", title: "Tarea 1", description: "Descripción de la tarea 1" },
  "task-2": { id: "task-2", title: "Tarea 2", description: "Descripción de la tarea 2" },
  "task-3": { id: "task-3", title: "Tarea 3", description: "Descripción de la tarea 3" },
  "task-4": { id: "task-4", title: "Tarea 4", description: "Descripción de la tarea 4" },
};

function Board() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const newColumns = Array.from(columns);
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      setColumns(newColumns);
      return;
    }

    if (type === "task") {
      const sourceColIndex = columns.findIndex((col) => col.id === source.droppableId);
      const destColIndex = columns.findIndex((col) => col.id === destination.droppableId);

      const sourceCol = columns[sourceColIndex];
      const destCol = columns[destColIndex];

      const sourceTaskIds = Array.from(sourceCol.taskIds);
      const [movedTaskId] = sourceTaskIds.splice(source.index, 1);

      if (sourceCol === destCol) {
        sourceTaskIds.splice(destination.index, 0, movedTaskId);
        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
        setColumns(newColumns);
      } else {
        const destTaskIds = Array.from(destCol.taskIds);
        destTaskIds.splice(destination.index, 0, movedTaskId);

        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
        newColumns[destColIndex] = { ...destCol, taskIds: destTaskIds };
        setColumns(newColumns);
      }
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="boardWrapper">
        <Dashboard />
        <div className="boardContent">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className="columnsContainer"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columns.map((column, index) => (
                    <Draggable draggableId={column.id} index={index} key={column.id}>
                      {(provided) => (
                        <div
                          className="columnWrapper"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div {...provided.dragHandleProps}>
                            <Column
                              id={column.id}
                              title={column.title}
                              tasks={column.taskIds.map((taskId) => tasks[taskId])}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default Board;
