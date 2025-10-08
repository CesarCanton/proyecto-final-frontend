import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskRow from "./TaskRow";

export default function TaskTable({ tareas, onDragEnd, abrirEditar, eliminarTarea }) {
  return (
    <div className="table-responsive table-scroll-md shadow-sm rounded" style={{ border: "1px solid #dee2e6", borderRadius: "12px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tareas-droppable">
          {(provided) => (
            <table className="table table-hover align-middle mb-0" {...provided.droppableProps} ref={provided.innerRef}>
              <thead className="table-dark text-center" style={{ fontSize: "0.9rem" }}>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Asignación</th>
                  <th>Fecha Límite</th>
                  <th>Asignó</th>
                  <th>Dirigido a</th>
                  <th>Estado</th>
                  <th>Avance</th>
                  <th>Prioridad</th>
                  <th>Días Totales</th>
                  <th>Días Faltantes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.length > 0 ? (
                  tareas.map((tarea, index) => (
                    <TaskRow key={tarea.id} tarea={tarea} index={index} abrirEditar={abrirEditar} eliminarTarea={eliminarTarea} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center py-3">
                      No hay tareas disponibles
                    </td>
                  </tr>
                )}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
