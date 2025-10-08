import React, { useState, useEffect } from "react";
import { getColumnsWithTasks, deleteTask } from "../services/taskAPI";
import TaskAddModal from "../components/tasks/TaskAddModal";
import TaskEditModal from "../components/tasks/TaskEditModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TaskPage.css"; // CSS externo para el scroll condicional

export default function TasksPage() {
  const [tareas, setTareas] = useState([]);
  const [tareasFiltradas, setTareasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);

  const fetchTareas = async () => {
    try {
      const data = await getColumnsWithTasks(2);
      const todas = data.flatMap((col) => col.tasks || []);
      setTareas(todas);
      setTareasFiltradas(todas);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const handleBuscar = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusqueda(texto);
    if (texto === "") setTareasFiltradas(tareas);
    else
      setTareasFiltradas(
        tareas.filter((t) => t.title.toLowerCase().includes(texto))
      );
  };

  const abrirEditar = (tarea) => {
    setTareaEditar(tarea);
    setShowEditModal(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      fetchTareas();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tareasFiltradas);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
    setTareasFiltradas(items);
  };

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
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">
        Gestión de Lista de Tareas
      </h2>

      {/* Buscador y botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          className="form-control w-50 shadow-sm"
          placeholder="Buscar tarea por nombre..."
          value={busqueda}
          onChange={handleBuscar}
          style={{
            borderRadius: "10px",
            padding: "10px 15px",
            border: "1px solid #ced4da",
          }}
        />
        <button
          className="btn btn-success shadow-sm px-4 py-2 btn-agregar-responsive"
          style={{ borderRadius: "8px" }}
          onClick={() => setShowAddModal(true)}
        >
          + Agregar Tarea
        </button>

      </div>

      {/* Tabla con scroll solo en móvil/tablet */}
      <div
        className="table-responsive table-scroll-md shadow-sm rounded"
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "12px",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tareas-droppable">
            {(provided) => (
              <table
                className="table table-hover align-middle mb-0"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead className="table-dark text-center" style={{ fontSize: "0.9rem" }}>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Asignación</th>
                    <th>Fecha Límite</th>
                    <th>Asignó</th>
                    <th>Dirigido a</th>
                    <th>Estado</th>
                    <th>Avance</th>
                    <th>Prioridad</th>
                    <th>Días Totales</th>
                    <th>Días Faltantes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tareasFiltradas.length > 0 ? (
                    tareasFiltradas.map((tarea, index) => {
                      const createdDate = new Date(tarea.created_at);
                      const dueDate = new Date(tarea.due_date);
                      const diffTime = Math.abs(dueDate - createdDate);
                      const daysTotal = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      const today = new Date();
                      const diffRemaining = Math.ceil(
                        (dueDate - today) / (1000 * 60 * 60 * 24)
                      );
                      const daysRemaining =
                        diffRemaining > 0 ? diffRemaining : 0;

                      return (
                        <Draggable
                          key={tarea.id}
                          draggableId={tarea.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: "grab",
                                backgroundColor:
                                  index % 2 === 0 ? "#f8f9fa" : "white",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <td className="text-center">{index + 1}</td>
                              <td className="fw-semibold">{tarea.title}</td>
                              <td>{tarea.description}</td>
                              <td className="text-center">
                                {createdDate.toLocaleDateString()}
                              </td>
                              <td
                                style={{ padding: "12px", width: "110px" }}
                                className="text-center"
                              >
                                {tarea.due_date}
                              </td>
                              <td className="text-center">
                                {tarea.created_by}
                              </td>
                              <td className="text-center">
                                {tarea.assigned_to}
                              </td>
                              <td className="text-center">
                                <span
                                  className={`badge bg-${getEstadoColor(
                                    tarea.deadline_status
                                  )}`}
                                >
                                  {tarea.deadline_status || "Pendiente"}
                                </span>
                              </td>
                              <td className="text-center">
                                <div
                                  className="progress"
                                  style={{ height: "8px", borderRadius: "5px" }}
                                >
                                  <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{
                                      width: `${tarea.progress_percentage}%`,
                                    }}
                                  ></div>
                                </div>
                                <small>{tarea.progress_percentage}%</small>
                              </td>
                              <td className="text-center">{tarea.priority}</td>
                              <td className="text-center">{daysTotal}</td>
                              <td
                                className={`text-center ${getDiasColor(
                                  daysRemaining
                                )}`}
                              >
                                {daysRemaining}
                              </td>
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
                                    onClick={() => eliminar(tarea.id)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center py-3">
                        No hay tareas disponibles
                      </td>
                    </tr>
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <TaskAddModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refresh={fetchTareas}
      />
      <TaskEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        refresh={fetchTareas}
        tarea={tareaEditar}
      />
    </div>
  );
}
