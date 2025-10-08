import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import CreateColumnModal from "../ui/colums/ModalAddColumn";
import "./boardStyles.css";
import { getBoardById } from "../../services/boardService";
//GER 3.RECIBE EL ID DEL TABLERO
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
      setBoardName(board.name || "Tablero de Proyectos");
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
      <Navbar
        expand="lg"
        className="custom-navbar shadow-sm w-100 border-bottom"
      >
        <Container className="d-flex justify-content-between">
          <Navbar.Brand href="#home" className="text-white fw-bold">
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Cargando...
              </>
            ) : (
              boardName
            )}
          </Navbar.Brand>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={toggleView}
            >
              {viewMode === "columns" ? "Vista tabla" : "Vista columnas"}
            </button>
            {/* boton para agregar columna */}
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleShowModal}
            >
              + Agregar Columna
            </button>
          </div>
        </Container>
      </Navbar>

      <CreateColumnModal
        show={showModal}
        onHide={handleCloseModal}
        boardId={boardId} // GER 4.PASAR EL ID DEL TABLERO PERO EN ESTE CASO LO ESTOY ENVIANDO A UN MODAL
        onColumnCreated={onColumnCreated}
      />
    </>
  );
}

export default NavbarComponent;
