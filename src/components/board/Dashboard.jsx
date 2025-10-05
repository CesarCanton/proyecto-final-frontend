import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./boardStyles.css";
import { useBoards } from "../../hooks/useBoards";

function Dashboard() {
  const { boards, loading, addBoard, removeBoard, updateBoard } = useBoards();
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const handleEditClick = (board) => {
    setEditingId(board.id);
    setEditedName(board.name);
  };

  const handleSaveClick = (id) => {
    updateBoard(id, { name: editedName });
    setEditingId(null);
  };

  return (
    <div className="dashContainer">
      <div className="sidebar d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-orange">🗂️ Tableros</h4>
          <button
            className="btn btn-orange rounded-circle"
            title="Agregar tablero"
            onClick={() => addBoard({ name: "Nuevo tablero", description: "" })}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        {loading ? (
          <p className="text-light">Cargando...</p>
        ) : (
          <ul className="list-unstyled">
            {boards.map((board) => (
              <li
                key={board.id}
                className="d-flex justify-content-between align-items-center mb-3 p-2 board-item"
              >
                {editingId === board.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-success me-1"
                      onClick={() => handleSaveClick(board.id)}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => setEditingId(null)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-light fw-medium">{board.name}</span>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={() => handleEditClick(board)}
                        title="Editar"
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeBoard(board.id)}
                        title="Eliminar"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
