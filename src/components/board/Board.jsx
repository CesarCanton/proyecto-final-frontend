import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "../board/Column";
import NavbarComponent from "./Navbar";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./boardStyles.css";
import { getColumnsWithTasks } from "../../services/taskAPI";
import TaskEditModal from "../tasks/taskEditModal";
import TaskDeleteModal from "../tasks/taskDeleteModal";

const initialColumns = [
  { id: "1", title: "Por hacer", taskIds: [] },
  { id: "2", title: "En progreso", taskIds: [] },
  { id: "3", title: "Revisión", taskIds: [] },
];

function Board() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
	const [showEditModal, setShowEditModal] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);

	const handleEditTask = (task) => {
	  setTaskToEdit(task);
	  setShowEditModal(true);
	};

	const handleDeleteTask = (task) => {
	  setTaskToDelete(task);
	  setShowDeleteModal(true);
	}

	const boardId = 2;

	useEffect(() => {
		loadTasks();
	}, []);

	const loadTasks = async () => {
		try {
			setLoading(true);
       console.log("Cargando tasks para boardId:", boardId);
			const apiData = await getColumnsWithTasks(boardId);

      // 1. Crear el mapa de tasks
			const tasksMap = {};
			apiData.forEach(column => {
        console.log(`Columna ${column.id}:`, column.tasks);
				column.tasks.forEach(task => {
				tasksMap[task.id] = {
					...task,
					id: task.id.toString()
				};
			});
		});

		// 2. Actualizar las columnas con los taskIds correctos
		const updatedColumns = columns.map(column => {
		    // Encontrar la columna correspondiente en los datos de la API
			const apiColumn = apiData.find(col => col.id.toString() === column.id);
      console.log(`Buscando columna ${column.id} en API:`, apiColumn);
			return {
					...column,
					taskIds: apiColumn ? apiColumn.tasks.map(task => task.id.toString()) : []
			};
		});
		setTasks(tasksMap);
		setColumns(updatedColumns);
		} 
		catch (error) {
			console.error("Error loading tasks:", error);
		}
		finally {
			setLoading(false);
		}
	};

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
                              tasks={column.taskIds.map((taskId) => tasks[taskId]).filter(task => task !== undefined)}
                              onEditTask={handleEditTask} 
                              onDeleteTask={handleDeleteTask}
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

      <TaskEditModal
				show={showEditModal}
				handleClose={() => setShowEditModal(false)}
				refresh={loadTasks} // Esta función recarga las tareas después de editar
				tarea={taskToEdit}
			/>

			<TaskDeleteModal
				show={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				refresh={loadTasks} // Esta función recarga las tareas después de eliminar
				task={taskToDelete}
			/>
    </>
  );
}

export default Board;
