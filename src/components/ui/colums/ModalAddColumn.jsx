import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { createColumn } from "../../../services/columnService";

function CreateColumnModal({ show, onHide, boardId, onColumnCreated }) {
	const [columnName, setColumnName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!columnName.trim()) {
			setError("El nombre de la columna es requerido");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const columnData = {
				name: columnName.trim(),
				boardId: boardId,
			};

			const newColumn = await createColumn(columnData, boardId);

			setColumnName("");
			onHide();

			if (onColumnCreated) {
				onColumnCreated(newColumn);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Error al crear la columna");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setColumnName("");
		setError("");
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton className="bg-orange text-white">
					<Modal.Title>
						<i className="fas fa-columns me-2"></i> Agregar Nueva Columna
					</Modal.Title>
				</Modal.Header>

				<Modal.Body className="bg-dark text-white">
					{error && (
						<Alert variant="danger" className="mb-3">
							{error}
						</Alert>
					)}

					<Form.Group className="mb-3">
						<Form.Label className="text-orange">Nombre de la Columna</Form.Label>
						<Form.Control
							type="text"
							className="bg-dark text-white border-orange"
							placeholder="Ingresa el nombre de la columna"
							value={columnName}
							onChange={(e) => setColumnName(e.target.value)}
							disabled={isLoading}
							autoFocus
						/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer className="bg-dark border-top border-orange">
					<Button
						className="btn btn-outline-orange d-flex align-items-center gap-1"
						onClick={handleClose}
						disabled={isLoading}
					>
						<i className="fas fa-times"></i> Cancelar
					</Button>

					<Button
						className="btn btn-orange d-flex align-items-center gap-1"
						type="submit"
						disabled={isLoading || !columnName.trim()}
					>
						<i className="fas fa-check"></i> {isLoading ? "Creando..." : "Crear Columna"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default CreateColumnModal;