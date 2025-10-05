import React, { useState } from "react";
import { deleteTask } from "../../services/taskAPI";

export default function TaskDeleteModal({ 
  show, 
  handleClose, 
  refresh, 
  task = null 
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const eliminarTarea = async () => {
    if (!task) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      handleClose();
      refresh(); // Actualiza la lista de tareas
    } catch (error) {
      console.error("Error eliminando tarea:", error.response?.data || error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Tarea</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={isDeleting}
            ></button>
          </div>
          
          <div className="modal-body">
            {task ? (
              <div className="alert alert-warning">
                <h6 className="alert-heading text-center">¿Estás seguro de que quieres eliminar esta tarea?</h6>
                <p className="mb-0 text-center">
                  <strong>"{task.title}"</strong> será eliminada permanentemente.
                  Esta acción no se puede deshacer.
                </p>
              </div>
            ) : (
              <div className="alert alert-danger">
                Error: No se ha seleccionado ninguna tarea para eliminar.
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-danger" 
              onClick={eliminarTarea}
              disabled={isDeleting || !task}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}