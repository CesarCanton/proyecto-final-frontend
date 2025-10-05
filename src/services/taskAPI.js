import api from "./api";

// Traer columnas con tareas
export const getColumnsWithTasks = async (boardId) => {
  const res = await api.get(`/boards/${boardId}/columns`);
  return res.data;
};

// Crear tarea
export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

// Actualizar tarea
export const updateTask = async (taskId, updates) => {
  const res = await api.put(`/tasks/${taskId}`, updates);
  return res.data;
};

// Eliminar tarea
export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
  return { message: `Tarea ${taskId} eliminada` };
};





