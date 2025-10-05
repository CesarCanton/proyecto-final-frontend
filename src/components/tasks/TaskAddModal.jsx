import React, { useState, useEffect } from "react";
import { createTask, getColumnsWithTasks } from "../../services/taskAPI";

export default function TaskAddModal({ show, handleClose, refresh, boardId = 2 }) {
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    progress_percentage: 0,
    due_date: "",
    column_id: 1,
    assigned_to: "",
    created_by: "",
  });

  const [errors, setErrors] = useState({});

  // 🔹 Cargar columnas
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const data = await getColumnsWithTasks(boardId);
        setColumns(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, column_id: data[0].id }));
        }
      } catch (error) {
        console.error("Error cargando columnas:", error);
      }
    };

    if (show) fetchColumns();
  }, [show, boardId]);

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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Tarea</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
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
                <label className="form-label">Avance (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={formData.progress_percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, progress_percentage: e.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Fecha límite</label>
                <input
                  type="date"
                  className={`form-control ${errors.due_date ? "is-invalid" : ""}`}
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
                {errors.due_date && <div className="invalid-feedback">{errors.due_date}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Asignado a</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Creado por</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.created_by}
                  onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                />
              </div>

              {/* 🔹 Campo columna con nombre y ID */}
              <div className="col-md-6">
                <label className="form-label">Columna</label>
                <select
                  className="form-select"
                  value={formData.column_id}
                  onChange={(e) =>
                    setFormData({ ...formData, column_id: parseInt(e.target.value, 10) })
                  }
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name} (ID {col.id})
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={guardarTarea}>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
