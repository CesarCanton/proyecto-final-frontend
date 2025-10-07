import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteColumn } from '../../../services/columnService';

function DeleteColumnModal({ show, onHide, column, onColumnDeleted, hasTasksInColumn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');

    try {
      await deleteColumn(column.id);
      
      // Llamar al callback para actualizar la lista de columnas
      if (onColumnDeleted) {
        onColumnDeleted(column.id);
      }
      
      // Cerrar el modal
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
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Columna</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {hasTasksInColumn ? (
          <>
            <Alert variant="warning" className="mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>¡Atención!</strong> Esta columna contiene tareas.
            </Alert>
            <p>
              La columna <strong>"{column?.name}"</strong> contiene <strong>{hasTasksInColumn}</strong> tarea(s).
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
              ¿Estás seguro de que deseas eliminar la columna <strong>"{column?.name}"</strong>?
            </p>
            <p className="text-muted">
              <small>Esta columna no contiene tareas. Esta acción no se puede deshacer.</small>
            </p>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          variant={hasTasksInColumn ? "danger" : "warning"}
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Eliminando...' : (hasTasksInColumn ? 'Eliminar Columna y Tareas' : 'Eliminar Columna')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteColumnModal;