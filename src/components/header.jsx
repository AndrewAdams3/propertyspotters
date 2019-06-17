import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = ({fixed}) => {
  return(
    <Navbar bg="light" expand="lg" fixed={fixed}>
      <Navbar.Brand href="/home">PropertySpotters</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto w-100">
          <Nav.Link href="/home">Home</Nav.Link>
          <NavDropdown title="DriveBys" id="basic-nav-dropdown">
            <NavDropdown.Item href="/table">Table View</NavDropdown.Item>
            <NavDropdown.Item href="/map">Map View</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/home">Users</Nav.Link>
          <div>
            <Nav.Link class="w-100 order-3 ml-auto" style={{textAlign: "end"}} href="/home">Logout</Nav.Link>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;