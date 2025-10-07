import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "../board/Column";
import NavbarComponent from "./Navbar";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./boardStyles.css";
import { getColumnsWithTasks, updateTask } from "../../services/taskAPI";
import { getColumns } from "../../services/columnService";
import TaskEditModal from "../ui/tasks/TaskEditModal";
import TaskDeleteModal from "../ui/tasks/taskDeleteModal";
// import ModalEditColumn from "../ui/colums/ModalEditColumn";

const boardId = 3; // GER 1.AQUI PUEDES CAMBIAR EL ID DEL TABLERO
function Board() {
	const [columns, setColumns] = useState([]);
	const [tasks, setTasks] = useState({});
	const [loading, setLoading] = useState(true);
	const [showEditModal, setShowEditModal] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);
	
	// Función para manejar la creación de nueva columna
	const handleColumnCreated = async (newColumn) => {
		const formattedColumn = {
			id: newColumn.id.toString(),
			board_id: newColumn.board_id || newColumn.boardId,
			name: newColumn.name,
			order: newColumn.order || columns.length,
			color: newColumn.color || null,
			created_at: newColumn.created_at || new Date().toISOString(),
			update_at: newColumn.update_at || new Date().toISOString(),
			taskIds: [], // Nueva columna sin tareas
		};

		setColumns((prevColumns) => [...prevColumns, formattedColumn]);
		await loadBoard(); // Recargar el tablero para asegurar consistencia
	};
	// Función para manejar la actualización de columna
	const handleColumnUpdated = (updatedColumn) => {
		setColumns((prevColumns) =>
			prevColumns.map((col) =>
				col.id === updatedColumn.id.toString()
					? { ...col, name: updatedColumn.name }
					: col
			)
		);
	};
	// Carga columnas y tareas juntas
	const loadBoard = async () => {
		try {
			setLoading(true);
			const apiData = await getColumnsWithTasks(boardId);

			// Construye el mapa de tareas
			const tasksMap = {};
			apiData.forEach((column) => {
				column.tasks.forEach((task) => {
					tasksMap[task.id] = {
						...task,
						id: task.id.toString(),
					};
				});
			});
			// Construye las columnas con taskIds
			const newColumns = apiData.map((col) => ({
				id: col.id.toString(),
				board_id: col.board_id,
				name: col.name,
				order: col.order,
				color: col.color,
				created_at: col.created_at,
				update_at: col.update_at,
				taskIds: col.tasks.map((t) => t.id.toString()),
			}));

			setColumns(newColumns);
			setTasks(tasksMap);
		} catch (error) {
			console.error("Error loading board:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadBoard();
	}, []);

	const onDragEnd = (result) => {
		const { source, destination, type } = result;
		if (!destination) return;

		if (type === "column") {
			const newColumns = Array.from(columns);
			const [moved] = newColumns.splice(source.index, 1);
			newColumns.splice(destination.index, 0, moved);
			setColumns(newColumns);
			return;
		}

		if (type === "task") {
			const sourceColIndex = columns.findIndex(
				(col) => col.id === source.droppableId
			);
			const destColIndex = columns.findIndex(
				(col) => col.id === destination.droppableId
			);
			if (sourceColIndex === -1 || destColIndex === -1) return;

			const sourceCol = columns[sourceColIndex];
			const destCol = columns[destColIndex];

			const sourceTaskIds = Array.from(sourceCol.taskIds);
			const [movedTaskId] = sourceTaskIds.splice(source.index, 1);

			if (sourceCol.id !== destCol.id) {
				const destTaskIds = Array.from(destCol.taskIds);
				destTaskIds.splice(destination.index, 0, movedTaskId);

				const newColumns = [...columns];
				newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
				newColumns[destColIndex] = { ...destCol, taskIds: destTaskIds };
				setColumns(newColumns);

				updateTask(movedTaskId, { column_id: destCol.id })
					.then(() => loadBoard())
					.catch((error) => {
						console.error("Error actualizando columna de la tarea:", error);
					});
				return;
			}

			// Solo reordenamiento dentro de la misma columna
			sourceTaskIds.splice(destination.index, 0, movedTaskId);
			const newColumns = [...columns];
			newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
			setColumns(newColumns);
		}
	};
	return (
		<>
			<NavbarComponent
				boardId={boardId}// GER 2.PASAR EL ID DEL TABLERO AL COMPONENTE
				onColumnCreated={handleColumnCreated}
			/>
			<div className="boardWrapper">
				<Dashboard />
				<div className="boardContent">
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable
							droppableId="all-columns"
							direction="horizontal"
							type="column"
						>
							{(provided) => (
								<div
									className="d-flex columnsContainer"
									ref={provided.innerRef}
									{...provided.droppableProps}
									style={{ overflowX: "auto", overflowY: "hidden" }}
								>
									{columns.map((column, idx) => (
										<Draggable
											draggableId={column.id.toString()}
											index={idx}
											key={column.id}
											type="column"
										>
											{(draggableProvided) => (
												<div
													ref={draggableProvided.innerRef}
													{...draggableProvided.draggableProps}
													style={{
														minWidth: "350px",
													}}
												>
													<Column
														id={column.id}
														name={column.name}
														tasks={column.taskIds.map(
															(taskId) => tasks[taskId]
														)}
														   onColumnUpdated={handleColumnUpdated}
														// dragHandleProps={draggableProvided.dragHandleProps}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
			</div>

			<TaskEditModal
				show={showEditModal}
				handleClose={() => setShowEditModal(false)}
				refresh={loadBoard} // Esta función recarga las tareas después de editar
				tarea={taskToEdit}
			/>

			<TaskDeleteModal
				show={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				refresh={loadBoard} // Esta función recarga las tareas después de eliminar
				task={taskToDelete}
			/>
			{/* <ModalEditColumn
                show={showEditColumnModal}
                onHide={() => setShowEditColumnModal(false)}
                column={columnToEdit}
                onColumnUpdated={handleColumnUpdated}
            /> */}
		</>
	);
}

export default Board;
