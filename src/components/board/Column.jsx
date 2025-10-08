import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Card, Button, Form } from "react-bootstrap";
import { Droppable } from "@hello-pangea/dnd";
import "./boardStyles.css";
import { updateColumn } from "../../services/columnService";
import DeleteColumnModal from "../ui/colums/ModalDeleteColumn";
import TaskAddModal2 from "../ui/tasks/TaskAddModal2";

function Column({
	id,
	name,
	tasks,
	onAddTask,
	onEditTask,
	onDeleteTask,
	onColumnUpdated,
	onDeleteColumn,
	// dragHandleProps,
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingName, setEditingName] = useState(name);
	const [isLoading, setIsLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showAddTaskModal, setShowAddTaskModal] = useState(false)


	  // Funciones para el modal de tarea
	const handleOpenAddTask = () => {
	  setShowAddTaskModal(true);
	};	
	const handleCloseAddTask = () => {
	  setShowAddTaskModal(false);
	};
  
	const handleTaskAdded = () => {
    handleCloseAddTask();
    if (onAddTask) {
      onAddTask();
    }
  	};

	const handleEditColumn = () => {
		setIsEditing(true);
		setEditingName(name);
	};
	const handleDeleteColumn = () => {
		setShowDeleteModal(true);
	};

	const handleSaveColumn = async () => {
		if (editingName.trim() === "") {
			setEditingName(name);
			setIsEditing(false);
			return;
		}

		if (editingName.trim() === name) {
			setIsEditing(false);
			return;
		}

		setIsLoading(true);
		try {
			const updatedColumn = await updateColumn(id, {
				name: editingName.trim(),
			});

			// Actualizar el estado local
			if (onColumnUpdated) {
				onColumnUpdated(updatedColumn);
			}

			setIsEditing(false);
		} catch (error) {
			console.error("Error updating column:", error);
			// Revertir cambios en caso de error
			setEditingName(name);
			setIsEditing(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setEditingName(name);
		setIsEditing(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSaveColumn();
		} else if (e.key === "Escape") {
			handleCancelEdit();
		}
	};

	const hasTasksInColumn = tasks && tasks.length > 0 ? tasks.length : 0;
	return (
		<>
			<Card className="p-2 shadow-sm">
				{/* capacidad para mover la columna deshabilitada */}
				{/* <Card.Header {...dragHandleProps} */}
				<Card.Header className="column-action-buttons"
					onMouseEnter={() => !isEditing && setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={{
						padding: "8px 12px",
						marginBottom: "12px",
						borderRadius: "6px",
						fontWeight: "bold",
						zIndex: 2,
						position: "relative",
					}}
				>
					<div className="d-flex align-items-center justify-content-between">
						{isEditing ? (
							<div className="d-flex align-items-center ">
								<Form.Control
									className="columnTitleEditing"
									type="text"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									onKeyDown={handleKeyPress}
									onBlur={handleSaveColumn}
									disabled={isLoading}
									autoFocus
									style={{
										width: "auto",
										borderRadius: "4px",
										fontSize: "1rem",
										marginRight: "8px",
									}}
								/>
								<div className="d-flex gap-1">
									<Button
										variant="outline-secondary"
										className="btn btn-sm"
										onClick={handleSaveColumn}
										disabled={isLoading}
										style={{ padding: "2px 6px", fontSize: "12px" }}
									>
										<i className="fas fa-check"></i>
									</Button>
									<Button
										variant="outline-secondary"
										onClick={handleCancelEdit}
										disabled={isLoading}
										style={{ padding: "2px 6px", fontSize: "12px" }}
									>
										<i className="fas fa-times"></i>
									</Button>
								</div>
							</div>
						) : (
							<>
								<Card.Title className="mb-0 column-title flex-grow-1">
									<div>{name}</div>
								</Card.Title>
								{isHovered && (
									<div className="d-flex gap-1">
										<Button
											variant="outline-secondary"
											size="sm"
											onClick={handleEditColumn}
											className="edit-column-btn"
											style={{
												padding: "2px 8px",
												fontSize: "12px",
												marginLeft: "8px",
											}}
										>
											<i className="fas fa-pencil-alt"></i>
										</Button>
										<Button
											variant="outline-danger"
											size="sm"
											onClick={handleDeleteColumn}
											className="delete-column-btn"
											style={{
												padding: "2px 8px",
												fontSize: "12px",
											}}
											title={
												hasTasksInColumn > 0
													? `Esta columna tiene ${hasTasksInColumn} tarea(s)`
													: "Eliminar columna vacía"
											}
										>
											<i
												className={
													hasTasksInColumn > 0
														? "fas fa-exclamation-triangle"
														: "fas fa-trash"
												}
											></i>
										</Button>
									</div>
								)}
							</>
						)}
					</div>
				</Card.Header>

				<Card.Body >
					<Droppable droppableId={id.toString()} type="task">
						{(dropProvided) => (
							<div
								ref={dropProvided.innerRef}
								{...dropProvided.droppableProps}
								style={{
									minHeight: "100px",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem",
								}}
							>
								{tasks.map((task, idx) => (
									<TaskCard
									
										key={task.id}
										task={task}
										draggableId={task.id.toString()}
										index={idx}
										onEdit={onEditTask}
										onDelete={onDeleteTask}
									/>
								))}
								{dropProvided.placeholder}
							</div>
						)}
					</Droppable>
					<button onClick={handleOpenAddTask}
						className="btn btn-outline-light btn-sm m-auto d-block mt-4">
						+ Agregar Tarea
					</button>
				</Card.Body>
			</Card>
			<DeleteColumnModal
				show={showDeleteModal}
				onHide={() => setShowDeleteModal(false)}
				column={{ id, name }}
				onColumnDeleted={onDeleteColumn}
				hasTasksInColumn={hasTasksInColumn}
			/>

			 <TaskAddModal2
        		show={showAddTaskModal}
        		handleClose={handleCloseAddTask}
        		refresh={handleTaskAdded}
        		column_id={id}
        		name={name}
      		/>
		</>
	);
}

export default Column;
