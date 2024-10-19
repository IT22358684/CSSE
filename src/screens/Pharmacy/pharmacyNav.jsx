import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Import NavLink for routing
import './pharmacyStyles.css'; // Ensure correct CSS file is linked

function NavBar() {
  return (
    <div>
      <Navbar expand="lg" className="vertical-navbar">
        <Container>
          <NavLink className="navbar-brand" to="/dashboard">PHARMACY</NavLink>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <NavLink 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
                to="/ViewInventory"
              >
                INVENTORY
              </NavLink>
              <NavLink 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
                to="/ViewPrescriptions"
              >
                PRESCRIPTIONS
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
