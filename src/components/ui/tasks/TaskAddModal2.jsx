import React, { useState, useEffect } from "react";
import { createTask } from "../../../services/taskAPI";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../board/boardStyles.css"; // Asegúrate que este CSS esté cargado

export default function TaskAddModal({ show, handleClose, refresh, column_id, name }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    progress_percentage: 0,
    due_date: "",
    column_id: column_id,
    columnName: name,
    assigned_to: "",
    created_by: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        progress_percentage: 0,
        due_date: "",
        column: parseInt(column_id, 10),
        columnName: name,
        assigned_to: "",
        created_by: "",
      });
      setErrors({});
    }
  }, [show, column_id, name]);

  const validarFormulario = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.due_date) newErrors.due_date = "La fecha límite es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const guardarTarea = async () => {
    if (!validarFormulario()) return;

    try {
      await createTask({
        ...formData,
        progress_percentage: parseInt(formData.progress_percentage, 10),
        column_id: column_id, // 
      });
      handleClose();
      refresh();
    } catch (error) {
      console.error("Error agregando tarea:", error.response?.data || error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white border-orange">
          <div className="modal-header bg-orange text-white">
            <h5 className="modal-title">
              <i className="fas fa-tasks me-2"></i> Agregar Tarea
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-orange">Título</label>
                <input
                  type="text"
                  className={`form-control bg-dark text-white border-orange ${errors.title ? "is-invalid" : ""}`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Descripción</label>
                <textarea
                  className="form-control bg-dark text-white border-orange"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Prioridad</label>
                <select
                  className="form-select bg-dark text-white border-orange"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="extreme">Extrema</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Avance (%)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-orange"
                  min="0"
                  max="100"
                  value={formData.progress_percentage}
                  onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-orange">Fecha límite</label>
                <input
                  type="date"
                  className={`form-control bg-dark text-white border-orange ${errors.due_date ? "is-invalid" : ""}`}
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
                {errors.due_date && <div className="invalid-feedback">{errors.due_date}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Asignado a</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Creado por</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.created_by}
                  onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-orange">Columna</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-orange"
                  value={formData.columnName}
                  readOnly
                />
                <input type="hidden" name="column" value={formData.column} />
              </div>
            </form>
          </div>

          <div className="modal-footer border-top border-orange">
            <button className="btn btn-outline-orange d-flex align-items-center gap-1" onClick={handleClose}>
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button className="btn btn-orange d-flex align-items-center gap-1" onClick={guardarTarea}>
              <i className="fas fa-check"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
