import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";


const Header = ({fixed}) => {
  return (
    <Navbar bg="light" expand="lg" fixed={fixed}>
      <Navbar.Brand><Link className="link" to="/home">PropertySpotters</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto w-100">
          <Nav.Link><Link className="link" to="/home">Home</Link></Nav.Link>
          <NavDropdown title="DriveBys" className="mt-2">
            <NavDropdown.Item><Link className="link" to="/table">Table View</Link></NavDropdown.Item>
            <NavDropdown.Item><Link className="link" to="/map">Map View</Link></NavDropdown.Item>
          </NavDropdown>
          <Nav.Link><Link className="link" to="/users">Users</Link></Nav.Link>
          <div className="w-100"/>
          <Nav.Link style={{ textAlign: "end" }}><Link className="link" to="/logout">Logout</Link></Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;