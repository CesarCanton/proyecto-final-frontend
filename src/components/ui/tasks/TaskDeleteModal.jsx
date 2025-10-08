import React, { useState } from "react";
import { deleteTask } from "../../../services/taskAPI";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../board/boardStyles.css"; // Asegúrate que este CSS esté cargado

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
      refresh();
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
        <div className="modal-content bg-dark text-white border-orange">
          <div className="modal-header bg-orange text-white">
            <h5 className="modal-title">
              <i className="fas fa-trash-alt me-2"></i> Eliminar Tarea
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={isDeleting}
            ></button>
          </div>
          
          <div className="modal-body">
            {task ? (
              <div className="alert alert-warning bg-dark text-white border-orange">
                <h6 className="alert-heading text-orange text-center">
                  ¿Estás seguro de que quieres eliminar esta tarea?
                </h6>
                <p className="mb-0 text-center">
                  <strong className="text-orange">"{task.title}"</strong> será eliminada permanentemente.<br />
                  Esta acción no se puede deshacer.
                </p>
              </div>
            ) : (
              <div className="alert alert-danger bg-dark text-white border-orange">
                Error: No se ha seleccionado ninguna tarea para eliminar.
              </div>
            )}
          </div>

          <div className="modal-footer border-top border-orange">
            <button 
              className="btn btn-outline-orange d-flex align-items-center gap-1" 
              onClick={handleClose}
              disabled={isDeleting}
            >
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button 
              className="btn btn-orange d-flex align-items-center gap-1" 
              onClick={eliminarTarea}
              disabled={isDeleting || !task}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Eliminando...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt"></i> Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
