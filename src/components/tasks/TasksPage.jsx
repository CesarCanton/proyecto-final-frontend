import React, { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import SearchBar from "../tasks/SearchBar";
import TaskTable from "../tasks/TaskTable";
import TaskAddModal from "../ui/tasks/TaskAddModal";
import TaskEditModal from "../ui/tasks/TaskEditModal";
import "./TaskPage.css";
import { useParams,useNavigate } from "react-router-dom";

export default function TasksPage() {
  const { boardId } = useParams(); // <-- ID dinámico desde la URL
  const { tareasFiltradas, fetchTareas, handleBuscar, eliminarTarea, onDragEnd, busqueda } = useTasks(boardId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);
  const navigate = useNavigate();
  
 const goToBoard = () => {
    navigate(`/board/${boardId}`); // Redirige a la vista principal de este tablero
  };;

  const abrirEditar = (tarea) => {
    setTareaEditar(tarea);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">Gestión de Lista de Tareas</h2>
       <button className="btn btn-secondary mb-3" onClick={goToBoard}>
        ← Volver al tablero
      </button>

      <SearchBar busqueda={busqueda} onBuscar={handleBuscar} onAgregar={() => setShowAddModal(true)} />

      <TaskTable tareas={tareasFiltradas} onDragEnd={onDragEnd} abrirEditar={abrirEditar} eliminarTarea={eliminarTarea} />

      <TaskAddModal show={showAddModal} handleClose={() => setShowAddModal(false)} refresh={fetchTareas} />
      <TaskEditModal show={showEditModal} handleClose={() => setShowEditModal(false)} refresh={fetchTareas} tarea={tareaEditar} />
    </div>
  );
}
