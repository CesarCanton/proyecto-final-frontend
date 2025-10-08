import { useState, useEffect } from "react";
import { getColumnsWithTasks, deleteTask } from "../services/taskAPI";

export function useTasks(boardId) {
  const [tareas, setTareas] = useState([]);
  const [tareasFiltradas, setTareasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const fetchTareas = async () => {
    try {
      const data = await getColumnsWithTasks(boardId);
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

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    if (!texto) setTareasFiltradas(tareas);
    else
      setTareasFiltradas(
        tareas.filter((t) =>
          t.title.toLowerCase().includes(texto.toLowerCase())
        )
      );
  };

  const eliminarTarea = async (id) => {
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

  return {
    tareasFiltradas,
    fetchTareas,
    handleBuscar,
    eliminarTarea,
    onDragEnd,
    busqueda,
  };
}
