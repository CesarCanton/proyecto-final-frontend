import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Form, Button, InputGroup, Dropdown, Table, Badge, ProgressBar } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import TaskAddModal2 from "../ui/tasks/TaskAddModal2";
import "./boardStyles.css";

function TableView({ columns, tasks, onEditTask, onDeleteTask, onDragEnd, refresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedColumn, setSelectedColumn] = useState("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  // Obtener todas las tareas con información de columna
  const allTasks = columns.flatMap(column =>
    column.taskIds
      .map(taskId => tasks[taskId])
      .filter(task => task)
      .map(task => ({
        ...task,
        columnName: column.name,
        columnId: column.id
      }))
  );

  // Filtrar tareas
  const filteredTasks = allTasks.filter(task =>
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPriority === "all" || task.priority === selectedPriority) &&
    (selectedAssignee === "all" || task.assigned_to === selectedAssignee) &&
    (selectedColumn === "all" || task.columnId === selectedColumn)
  );

  // Obtener listas únicas para filtros
  const assignees = [...new Set(allTasks.map(task => task.assigned_to).filter(Boolean))];
  const columnOptions = columns.map(col => ({ id: col.id, name: col.name }));

  const handleOpenAddTask = (columnId) => {
    setSelectedColumnId(columnId);
    setShowAddTaskModal(true);
  };

  const handleCloseAddTask = () => {
    setShowAddTaskModal(false);
    setSelectedColumnId(null);
  };

  const handleTaskAdded = () => {
    handleCloseAddTask();
    if (refresh) refresh(); // 
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPriority("all");
    setSelectedAssignee("all");
    setSelectedColumn("all");
  };

  const hasActiveFilters = searchTerm || selectedPriority !== "all" || selectedAssignee !== "all" || selectedColumn !== "all";

  // Colores de prioridad
  const priorityColors = {
    high: "danger",
    medium: "warning",
    low: "success",
  };

  // Colores para columnas (puedes personalizar esto)
  const columnColors = [
    "primary", "success", "warning", "info", "secondary", "dark"
  ];

  const getColumnColor = (columnId) => {
    const index = columns.findIndex(col => col.id === columnId);
    return columnColors[index % columnColors.length];
  };

  return (
    <>
      {/* Barra de herramientas COMPACTA */}
      <div className="table-view-toolbar mb-3 p-3 bg-dark rounded">
        <div className="d-flex justify-content-between align-items-center gap-3">
          {/* Lado izquierdo: Búsqueda y Filtros */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Barra de búsqueda */}
            <InputGroup style={{ width: "250px" }}>
              <InputGroup.Text className="bg-orange border-orange">
                <i className="fas fa-search text-white"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-orange"
              />
            </InputGroup>

            {/* Filtro por prioridad */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-orange" size="sm">
                <i className="fas fa-filter me-1"></i>
                Prioridad
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectedPriority("all")}
                  className={selectedPriority === "all" ? "active" : ""}
                >
                  Todas
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => setSelectedPriority("high")}
                  className={selectedPriority === "high" ? "active" : ""}
                >
                  🔴 Alta
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedPriority("medium")}
                  className={selectedPriority === "medium" ? "active" : ""}
                >
                  🟡 Media
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedPriority("low")}
                  className={selectedPriority === "low" ? "active" : ""}
                >
                  🟢 Baja
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Filtro por asignado */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-orange" size="sm">
                <i className="fas fa-user me-1"></i>
                Asignado
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectedAssignee("all")}
                  className={selectedAssignee === "all" ? "active" : ""}
                >
                  Todos
                </Dropdown.Item>
                <Dropdown.Divider />
                {assignees.map(assignee => (
                  <Dropdown.Item
                    key={assignee}
                    onClick={() => setSelectedAssignee(assignee)}
                    className={selectedAssignee === assignee ? "active" : ""}
                  >
                    {assignee}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Filtro por columna */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-orange" size="sm">
                <i className="fas fa-columns me-1"></i>
                Columna
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectedColumn("all")}
                  className={selectedColumn === "all" ? "active" : ""}
                >
                  Todas las columnas
                </Dropdown.Item>
                <Dropdown.Divider />
                {columnOptions.map(column => (
                  <Dropdown.Item
                    key={column.id}
                    onClick={() => setSelectedColumn(column.id)}
                    className={selectedColumn === column.id ? "active" : ""}
                  >
                    {column.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={clearFilters}
              >
                <i className="fas fa-times me-1"></i>
                Limpiar
              </Button>
            )}
          </div>

          {/* Lado derecho: Botón nueva tarea */}
          <Button
            variant="orange"
            size="sm"
            onClick={() => handleOpenAddTask(columns[0]?.id)}
          >
            <i className="fas fa-plus me-2"></i>
            Nueva Tarea
          </Button>
        </div>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-2">
            <small className="text-warning">
              <i className="fas fa-info-circle me-1"></i>
              Mostrando {filteredTasks.length} de {allTasks.length} tareas
              {searchTerm && ` • Búsqueda: "${searchTerm}"`}
              {selectedPriority !== "all" && ` • Prioridad: ${selectedPriority}`}
              {selectedAssignee !== "all" && ` • Asignado: ${selectedAssignee}`}
              {selectedColumn !== "all" && ` • Columna: ${columns.find(col => col.id === selectedColumn)?.name}`}
            </small>
          </div>
        )}
      </div>

      {/* Tabla única con todas las tareas */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="table-container">
          <Card className="bg-dark border-orange">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 text-light table-unified">
                <thead className="bg-orange text-white">
                  <tr>
                    <th style={{ width: "25%" }}>Tarea</th>
                    <th style={{ width: "12%" }}>Asignado</th>
                    <th style={{ width: "10%" }}>Prioridad</th>
                    <th style={{ width: "12%" }}>Fecha Límite</th>
                    <th style={{ width: "15%" }}>Progreso</th>
                    <th style={{ width: "16%" }}>Columna</th>
                    <th style={{ width: "10%" }}>Acciones</th>
                  </tr>
                </thead>
                <Droppable droppableId="table-view" type="task">
                  {(provided) => (
                    <tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                            {allTasks.length === 0 ? 'No hay tareas en el tablero' : 'No hay tareas que coincidan con los filtros'}
                          </td>
                        </tr>
                      ) : (
                        filteredTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  task-table-row
                                  ${snapshot.isDragging ? 'dragging' : ''}
                                `}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {/* Título y Descripción */}
                                <td>
                                  <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                      <strong className="text-orange d-block">
                                        {task.title.toUpperCase()}
                                      </strong>

                                      {task.description && (
                                        <small className="text-muted">
                                          {task.description.length > 60
                                            ? `${task.description.substring(0, 60)}...`
                                            : task.description}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Asignado */}
                                <td className="align-middle">
                                  <small>{task.assigned_to}</small>
                                </td>

                                {/* Prioridad */}
                                <td className="align-middle">
                                  <Badge bg={priorityColors[task.priority] || "secondary"}>
                                    {task.priority}
                                  </Badge>
                                </td>

                                {/* Fecha Límite */}
                                <td className="align-middle">
                                  <small>{task.due_date}</small>
                                </td>

                                {/* Progreso */}
                                <td className="align-middle">
                                  <div className="d-flex align-items-center gap-2">
                                    <ProgressBar
                                      now={task.progress_percentage}
                                      variant="warning"
                                      style={{ height: "8px", flex: 1 }}
                                    />
                                    <small className="text-nowrap">
                                      {task.progress_percentage}%
                                    </small>
                                  </div>
                                </td>

                                {/* Columna */}
                                <td className="align-middle">
                                  <Badge
                                    bg={getColumnColor(task.columnId)}
                                    className="text-white"
                                  >
                                    {task.columnName}
                                  </Badge>
                                </td>

                                {/* Acciones */}
                                <td className="align-middle">
                                  <div className="d-flex gap-2">
                                    <PencilSquare
                                      role="button"
                                      className="text-primary"
                                      size={18}
                                      onClick={() => onEditTask(task)}
                                      title="Editar tarea"
                                    />
                                    <Trash
                                      role="button"
                                      className="text-danger"
                                      size={18}
                                      onClick={() => onDeleteTask(task)}
                                      title="Eliminar tarea"
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </DragDropContext>

      {/* Modal para agregar tarea */}
      <TaskAddModal2
        show={showAddTaskModal}
        handleClose={handleCloseAddTask}
        refresh={handleTaskAdded}
        column_id={selectedColumnId}
        name={columns.find(col => col.id === selectedColumnId)?.name || "Columna"}
      />
    </>
  );
}

export default TableView;