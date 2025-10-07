import React, { useState, useEffect } from "react";
import { updateTask } from "../../../services/taskAPI";

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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tarea</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
                  value={formData.priority || "medium"}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Avance (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={formData.progress_percentage || 0}
                  onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha límite</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.due_date || ""}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Asignado a</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.assigned_to || ""}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Creado por</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.created_by || ""}
                  onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardarTarea}>Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}
