import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import "./boardStyles.css";

function NavbarComponent() {
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm w-100 mb-4 border rounded border-1 content">
            <Container>
                <Navbar.Brand href="#home">Mi Tablero Kanban</Navbar.Brand>
                <Nav className="p-2">
                    
                </Nav>
            </Container>
        </Navbar>
    );
}   
export default NavbarComponent;