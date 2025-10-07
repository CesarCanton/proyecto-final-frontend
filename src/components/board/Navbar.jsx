import React,{useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import CreateColumnModal from "../ui/colums/ModalAddColumn";
import "./boardStyles.css";
//GER 3.RECIBE EL ID DEL TABLERO
function NavbarComponent({ boardId, onColumnCreated }) {
const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
     <>
      <Navbar expand="lg" className="custom-navbar shadow-sm w-100 border-bottom">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand href="#home" className="text-white fw-bold">
            Tablero de Proyectos
          </Navbar.Brand>
          
          {/* boton para agregar columna */}
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={handleShowModal}
          >
            + Agregar Columna
          </button>
        </Container>
      </Navbar>

      <CreateColumnModal
        show={showModal}
        onHide={handleCloseModal}
        boardId={boardId}// GER 4.PASAR EL ID DEL TABLERO PERO EN ESTE CASO LO ESTOY ENVIANDO A UN MODAL
        onColumnCreated={onColumnCreated}
      />
    </>
  );
}

export default NavbarComponent;