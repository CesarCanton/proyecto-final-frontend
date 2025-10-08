import React, { useState, useEffect } from "react";
import { updateTask } from "../../../services/taskAPI";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../board/boardStyles.css"; // Asegúrate que este CSS esté cargado

export default function TaskEditModal({ show, handleClose, refresh, tarea }) {
  const [formData, setFormData] = useState({ ...tarea });

  useEffect(() => {
    setFormData({ ...tarea });
  }, [tarea]);

  const guardarTarea = async () => {
    try {
      await updateTask(tarea.id, formData);
      handleClose();
      refresh();
    } catch (error) {
      console.error("Error editando tarea:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white border-orange">
          <div className="modal-header bg-orange text-white">
            <h5 className="modal-title">
              <i className="fas fa-edit me-2"></i> Editar Tarea
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-orange">Título</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Descripción</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Prioridad</label>
                <select
                  className="form-select bg-dark text-white border-orange"
                  value={formData.priority || "medium"}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Avance (%)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-orange"
                  min="0"
                  max="100"
                  value={formData.progress_percentage || 0}
                  onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Fecha límite</label>
                <input
                  type="date"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.due_date || ""}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Asignado a</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.assigned_to || ""}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Creado por</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.created_by || ""}
                  onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                />
              </div>
            </form>
          </div>

          <div className="modal-footer border-top border-orange">
            <button className="btn btn-outline-orange d-flex align-items-center gap-1" onClick={handleClose}>
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button className="btn btn-orange d-flex align-items-center gap-1" onClick={guardarTarea}>
              <i className="fas fa-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
