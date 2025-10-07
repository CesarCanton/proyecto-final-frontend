import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createColumn } from '../../../services/columnService';

function CreateColumnModal({ show, onHide, boardId, onColumnCreated }) {
  const [columnName, setColumnName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!columnName.trim()) {
      setError('El nombre de la columna es requerido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const columnData = {
        name: columnName.trim(),
        boardId: boardId
      };

      const newColumn = await createColumn(columnData, boardId);
      
      // Limpiar el formulario
      setColumnName('');
      
      // Cerrar el modal
      onHide();
      
      // Llamar al callback para actualizar la lista de columnas
      if (onColumnCreated) {
        onColumnCreated(newColumn);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la columna');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setColumnName('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Columna</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Columna</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa el nombre de la columna"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isLoading || !columnName.trim()}
          >
            {isLoading ? 'Creando...' : 'Crear Columna'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateColumnModal;