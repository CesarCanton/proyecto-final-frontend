import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "../board/Column";
import NavbarComponent from "./Navbar";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./boardStyles.css";
import { getColumnsWithTasks, updateTask } from "../../services/taskAPI";
import TaskEditModal from "../ui/tasks/TaskEditModal";
import TaskDeleteModal from "../ui/tasks/TaskDeleteModal";
import TaskAddModal from "../ui/tasks/TaskAddModal";
import TaskAddModal2 from "../ui/tasks/TaskAddModal2";
import TableView from "./TableView";
// GER 1.AQUI PUEDES CAMBIAR EL ID DEL TABLERO
function Board({ boardId, onBoardSelect }) {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState("columns"); // 'columns' | 'table'  // Función para manejar la creación de nueva columna
  const handleColumnCreated = async () => {
    await loadBoard();
  };
  // Función para manejar la actualización de columna
  const handleColumnUpdated = (updatedColumn) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === updatedColumn.id.toString()
          ? { ...col, name: updatedColumn.name }
          : col
      )
    );
  };

  // Función para manejar la eliminación de columna
  const handleColumnDeleted = async () => {
    await loadBoard();
  };
  // Función para manejar la edición de tarea
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };
  // Función para manejar la eliminación de tarea
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };
  // Carga columnas y tareas juntas
  const loadBoard = async () => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiData = await getColumnsWithTasks(boardId);

      // Construye el mapa de tareas
      const tasksMap = {};
      apiData.forEach((column) => {
        column.tasks.forEach((task) => {
          tasksMap[task.id] = {
            ...task,
            id: task.id.toString(),
          };
        });
      });
      // Construye las columnas con taskIds
      const newColumns = apiData.map((col) => ({
        id: col.id.toString(),
        board_id: col.board_id,
        name: col.name,
        order: col.order,
        color: col.color,
        created_at: col.created_at,
        update_at: col.update_at,
        taskIds: col.tasks.map((t) => t.id.toString()),
      }));

      setColumns(newColumns);
      setTasks(tasksMap);
    } catch (error) {
      console.error("Error loading board:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const onDragEnd = (result) => {
    //Source: de donde se arrastra
    //Destination: a donde se suelta
    //Type: tipo de elemento que se esta moviendo (columna o tarea)
    const { source, destination, type } = result;
    if (!destination) return;
    //Logica para mover columnas (Desahbilitada por ahora)
    if (type === "column") {
      const newColumns = Array.from(columns);
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      setColumns(newColumns);
      return;
    }
    //Logica para mover tareas
    if (type === "task") {
      // Encontrar los índices de las columnas de origen y destino
      const sourceColIndex = columns.findIndex(
        (col) => col.id === source.droppableId
      );
      const destColIndex = columns.findIndex(
        (col) => col.id === destination.droppableId
      );
      // Si no se encuentran las columnas, salir
      if (sourceColIndex === -1 || destColIndex === -1) return;

      // Obtener las columnas de origen y destino

      const sourceCol = columns[sourceColIndex];
      const destCol = columns[destColIndex];

      const sourceTaskIds = Array.from(sourceCol.taskIds);
      const [movedTaskId] = sourceTaskIds.splice(source.index, 1);

      //Movimiento entre columnas
      if (sourceCol.id !== destCol.id) {
        const destTaskIds = Array.from(destCol.taskIds);
        destTaskIds.splice(destination.index, 0, movedTaskId);

        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
        newColumns[destColIndex] = { ...destCol, taskIds: destTaskIds };
        setColumns(newColumns);

        updateTask(movedTaskId, { column_id: destCol.id })
          .then(() => loadBoard())
          .catch((error) => {
            console.error("Error actualizando columna de la tarea:", error);
          });
        return;
      }

      // Solo reordenamiento dentro de la misma columna
      sourceTaskIds.splice(destination.index, 0, movedTaskId);
      const newColumns = [...columns];
      newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
      setColumns(newColumns);
    }
  };

  const handleBoardSelect = (id) => {
    onBoardSelect(id); // actualiza el boardId

    // Si está en modo móvil, cerrar el sidebar
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };


  // Mostrar mensaje si no hay board seleccionado
  if (!boardId) {
    return (
      <>

        <div className="boardWrapper no-board-selected">
          {showSidebar && (
            <Dashboard onBoardSelect={handleBoardSelect} />
          )}


          <div className="boardContent d-flex flex-column align-items-center justify-content-center">
            <div className="tableros-header text-center mb-4">
              <h4 className="text-orange fw-bold mb-2">Tableros</h4>
              <hr className="orange-line" />
            </div>

            <div className="empty-board-message text-center">
              <i className="fas fa-clipboard-list fa-3x text-orange mb-3"></i>
              <h3 className="text-orange fw-bold">Selecciona un tablero</h3>
              <p className="text-light">Elige un tablero del sidebar para comenzar a trabajar</p>
            </div>
          </div>
        </div>


      </>
    );
  }

  return (
    <>
      <NavbarComponent
        boardId={boardId}
        onColumnCreated={handleColumnCreated}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <button
        className="hamburger-toggle d-md-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <i className="fas fa-bars me-2"></i> Tableros
      </button>

      <div className="boardWrapper">
        {showSidebar && (
          <Dashboard onBoardSelect={handleBoardSelect} selectedBoardId={boardId} />
        )}

        <div className="boardContent" data-view={viewMode}>
          {viewMode === "columns" ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    className="d-flex columnsContainer"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ overflowX: "auto", overflowY: "hidden" }}
                  >
                    {columns.map((column, idx) => (
                      <Draggable
                        draggableId={column.id.toString()}
                        index={idx}
                        key={column.id}
                        type="column"
                      >
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            style={{
                              minWidth: "350px",
                            }}
                          >
                            <Column
                              id={column.id}
                              name={column.name}
                              tasks={column.taskIds
                                .map((taskId) => tasks[taskId])
                                .filter((task) => task)}
                              onAddTask={loadBoard}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                              onColumnUpdated={handleColumnUpdated}
                              onDeleteColumn={handleColumnDeleted}
                            // dragHandleProps={draggableProvided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <TableView
              columns={columns}
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDragEnd={onDragEnd}
            />
          )}
        </div>
      </div>

      <TaskEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        refresh={loadBoard}
        tarea={taskToEdit}
      />

      <TaskDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        refresh={loadBoard}
        task={taskToDelete}
      />

    </>
  );
}

export default Board;
