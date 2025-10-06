import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "../board/Column";
import NavbarComponent from "./Navbar";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./boardStyles.css";
import { getColumnsWithTasks } from "../../services/taskAPI";
import { getColumns } from "../../services/columnService";
import TaskEditModal from "../tasks/taskEditModal";
import TaskDeleteModal from "../tasks/taskDeleteModal";

// const initialColumns = [
// 	{ id: "1", nombre: "Por hacer", taskIds: [] },
// 	{ id: "2", nombre: "En progreso", taskIds: [] },
// 	{ id: "3", nombre: "Revisión", taskIds: [] },
// 	// { id: "4", nombre: "Revisión", taskIds: [] },
// 	// { id: "5", nombre: "Revisión", taskIds: [] },
// ];
const boardId = 2;
function Board() {
	const [columns, setColumns] = useState([]);
	const [tasks, setTasks] = useState({});
	const [loading, setLoading] = useState(true);
	const [showEditModal, setShowEditModal] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);

	const handleEditTask = (task) => {
		setTaskToEdit(task);
		setShowEditModal(true);
	};

	const handleDeleteTask = (task) => {
		setTaskToDelete(task);
		setShowDeleteModal(true);
	};

	

	useEffect(() => {
		// loadTasks();
		const obtenerColumnas = async () => {
			const data = await getColumnsWithTasks(boardId);
			const newColumns = data.map((col) => ({
				id: col.id,
				board_id: col.board_id,
				name: col.name,
				order: col.order,
				color: col.color,
				created_at: col.created_at,
				update_at: col.update_at,
				taskIds: col.tasks.map((t) => t.id),
			}));

			const newTasks = {};
			data.forEach((col) => {
				col.tasks.forEach((t) => {
					newTasks[t.id] = t;
				});
			});
			setColumns(newColumns);
			setTasks(newTasks);
		};
		obtenerColumnas();
	}, []);


	const loadColumns = async () => {
		try {
			const cols = await getColumns(boardId);
			setColumns(cols);	
		} catch (error) {
			console.error("Error loading columns:", error);
		}
	};
	
	const loadTasks = async () => {
		try {
			setLoading(true);
			console.log("Cargando tasks para boardId:", boardId);
			const apiData = await getColumnsWithTasks(boardId);

			// 1. Crear el mapa de tasks
			const tasksMap = {};
			apiData.forEach((column) => {
				console.log(`Columna ${column.id}:`, column.tasks);
				column.tasks.forEach((task) => {
					tasksMap[task.id] = {
						...task,
						id: task.id.toString(),
					};
				});
			});

			// 2. Actualizar las columnas con los taskIds correctos
			const updatedColumns = columns.map((column) => {
				// Encontrar la columna correspondiente en los datos de la API
				const apiColumn = apiData.find(
					(col) => col.id.toString() === column.id
				);
				console.log(`Buscando columna ${column.id} en API:`, apiColumn);
				return {
					...column,
					taskIds: apiColumn
						? apiColumn.tasks.map((task) => task.id.toString())
						: [],
				};
			});
			setTasks(tasksMap);
			setColumns(updatedColumns);
		} catch (error) {
			console.error("Error loading tasks:", error);
		} finally {
			setLoading(false);
		}
	};

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

			if (sourceCol === destCol) {
				sourceTaskIds.splice(destination.index, 0, movedTaskId);
				const newColumns = [...columns];
				newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
				setColumns(newColumns);
			} else {
				const destTaskIds = Array.from(destCol.taskIds);
				destTaskIds.splice(destination.index, 0, movedTaskId);

				const newColumns = [...columns];
				newColumns[sourceColIndex] = { ...sourceCol, taskIds: sourceTaskIds };
				newColumns[destColIndex] = { ...destCol, taskIds: destTaskIds };
				setColumns(newColumns);
			}
		}
	};

	return (
		<>
			<NavbarComponent />
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
														// maxWidth: "400px",
														
													}}
												>
													<Column
														id={column.id}
														name={column.name}
														tasks={column.taskIds.map(
															(taskId) => tasks[taskId]
														)}
														onEditTask={handleEditTask}
														onDeleteTask={handleDeleteTask}
														dragHandleProps={draggableProvided.dragHandleProps}
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
				refresh={loadTasks} // Esta función recarga las tareas después de editar
				tarea={taskToEdit}
			/>

			<TaskDeleteModal
				show={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				refresh={loadTasks} // Esta función recarga las tareas después de eliminar
				task={taskToDelete}
			/>
		</>
	);
}

export default Board;
