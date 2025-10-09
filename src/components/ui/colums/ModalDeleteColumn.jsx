import React, { useState } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { deleteColumn } from '../../../services/columnService';
import '../../board/boardStyles.css'; 

function DeleteColumnModal({ show, onHide, column, onColumnDeleted, hasTasksInColumn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');

    try {
      await deleteColumn(column.id);
      if (onColumnDeleted) {
        onColumnDeleted(column.id);
      }
      onHide();
    } catch (err) {
      console.error('Error eliminando columna:', err);
      setError(err.response?.data?.message || 'Error al eliminar la columna');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <div className="modal-content bg-dark text-white border-orange">
        <div className="modal-header bg-orange text-white border-bottom border-orange">
          <h5 className="modal-title">
            <i className="fas fa-trash-alt me-2"></i> Eliminar Columna
          </h5>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-danger border-orange bg-dark text-white">
              {error}
            </div>
          )}

          {hasTasksInColumn ? (
            <>
              <div className="alert alert-warning border-orange bg-dark text-white">
                <i className="fas fa-exclamation-triangle me-2 text-orange"></i>
                <strong className="text-orange">¡Atención!</strong> Esta columna contiene tareas.
              </div>
              <p>
                La columna <strong className="text-orange">"{column?.name}"</strong> contiene <strong>{hasTasksInColumn}</strong> tarea(s).
              </p>
              <p className="text-danger">
                <strong>¿Estás seguro de que deseas eliminar esta columna y todas sus tareas?</strong>
              </p>
              <p className="text-muted">
                <small>Esta acción no se puede deshacer. Se eliminarán permanentemente la columna y todas las tareas que contiene.</small>
              </p>
            </>
          ) : (
            <>
              <p>
                ¿Estás seguro de que deseas eliminar la columna <strong className="text-orange">"{column?.name}"</strong>?
              </p>
              <p className="text-muted">
                <small>Esta columna no contiene tareas. Esta acción no se puede deshacer.</small>
              </p>
            </>
          )}
        </div>

        <div className="modal-footer border-top border-orange">
          <Button
            className="btn btn-outline-orange d-flex align-items-center gap-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i> Cancelar
          </Button>
          <Button
            className="btn btn-orange d-flex align-items-center gap-1"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt"></i>
                {hasTasksInColumn ? 'Eliminar Columna y Tareas' : 'Eliminar Columna'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteColumnModal;
