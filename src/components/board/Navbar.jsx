import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import "./boardStyles.css";

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm w-100 border-bottom">
      <Container>
        <Navbar.Brand href="#home" className="text-white fw-bold">
          Mi Tablero Kanban
        </Navbar.Brand>
        <Nav className="p-2">
          {/* Puedes agregar enlaces aquí */}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
