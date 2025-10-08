import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import CreateColumnModal from "../ui/colums/ModalAddColumn";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./boardStyles.css";
import { getBoardById } from "../../services/boardService";


function NavbarComponent({ boardId, onColumnCreated, viewMode, setViewMode }) {
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState("Tablero de Proyectos");
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const toggleView = () => {
    setViewMode(viewMode === "columns" ? "table" : "columns");
  };
  // Función para obtener el nombre del tablero
  const loadBoardName = async () => {
    if (!boardId) {
      setBoardName("Tablero de Proyectos");
      return;
    }

    try {
      setLoading(true);
      const board = await getBoardById(boardId);
      setBoardName(board?.name?.toUpperCase()
        || "Tablero de Proyectos");
    } catch (error) {
      console.error("Error loading board name:", error);
      setBoardName("Tablero de Proyectos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar el nombre del tablero cuando cambia el boardId
  useEffect(() => {
    loadBoardName();
  }, [boardId]);
  return (
    <>
      <Navbar className="custom-navbar shadow-sm w-100 border-bottom border-top-orange">
        <Container fluid className="navbar-flex">
          <div className="navbar-title blink-title">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              boardName
            )}
          </div>

          <div className="navbar-actions">
            <button
              className="btn btn-outline-orange btn-navbar"
              onClick={toggleView}
            >
              <i className={`fas ${viewMode === "columns" ? "fa-table" : "fa-columns"} me-2`}></i>
              {viewMode === "columns" ? "Vista tabla" : "Vista columnas"}
            </button>
            <button
              className="btn btn-orange btn-navbar"
              onClick={handleShowModal}
            >
              <i className="fas fa-plus me-2"></i>
              Agregar Columna
            </button>
          </div>
        </Container>
      </Navbar>


      <CreateColumnModal
        show={showModal}
        onHide={handleCloseModal}
        boardId={boardId} 
        onColumnCreated={onColumnCreated}
      />
    </>
  );
}

export default NavbarComponent;
