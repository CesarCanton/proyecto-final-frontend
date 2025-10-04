import React, { useState, useEffect } from "react";
import { getColumnsWithTasks, deleteTask } from "../services/taskAPI";
import TaskAddModal from "../components/tasks/TaskAddModal";
import TaskEditModal from "../components/tasks/TaskEditModal";

export default function TasksPage() {
  const [tareas, setTareas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);

  const fetchTareas = async () => {
    try {
      const data = await getColumnsWithTasks(2); // boardId = 2
      const todas = data.flatMap((col) => col.tasks || []);
      setTareas(todas);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

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

  return (
    <div className="container mt-4">
      <h2 className="mb-4 d-flex justify-content-center">Gestión de Lista de Tareas</h2>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success"
          onClick={() => setShowAddModal(true)}
        >
          Agregar Tarea
        </button>
      </div>

      {/* Contenedor responsive */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID Columna</th>
              <th>Nº</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Asignación</th>
              <th>Fecha Límite</th>
              <th>Días Totales</th>
              <th>Prioridad</th>
              <th>Días Faltantes</th>
              <th>Estado</th>
              <th>Avance</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.length > 0 ? (
              tareas.map((tarea, index) => {
                const createdDate = new Date(tarea.created_at);
                const dueDate = new Date(tarea.due_date);

                // Calcular días totales
                const diffTime = Math.abs(dueDate - createdDate);
                const daysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Calcular días faltantes
                const today = new Date();
                const diffRemaining = Math.ceil(
                  (dueDate - today) / (1000 * 60 * 60 * 24)
                );
                const daysRemaining = diffRemaining > 0 ? diffRemaining : 0;

                // Calcular estado
                const estado =
                  tarea.progress_percentage === 100
                    ? "Completado"
                    : today > dueDate
                      ? "Vencido"
                      : "Pendiente";

                return (
                  <tr key={tarea.id}>
                    <td style={{ padding: "12px" }}>{tarea.column_id}</td>
                    <td style={{ padding: "12px" }}>{index + 1}</td>
                    <td style={{ padding: "12px" }}>{tarea.title}</td>
                    <td style={{ padding: "12px" }}>{tarea.description}</td>
                    <td style={{ padding: "12px" }}>
                      {createdDate.toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>{tarea.due_date}</td>
                    <td style={{ padding: "12px" }}>{daysTotal}</td>
                    <td style={{ padding: "12px" }}>{tarea.priority}</td>
                    <td style={{ padding: "12px" }}>{daysRemaining}</td>
                    <td style={{ padding: "12px" }}>{estado}</td>
                    <td style={{ padding: "12px" }}>
                      {tarea.progress_percentage}%
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div className="d-flex">
                        <button
                        className="btn btn-sm btn-warning me-2 mb-1"
                        onClick={() => abrirEditar(tarea)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger mb-1"
                        onClick={() => eliminar(tarea.id)}
                      >
                        Eliminar
                      </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" className="text-center p-3">
                  No hay tareas disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
