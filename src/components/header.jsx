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
          <div className="my-auto mx-auto"><Link className="link" to="/home">Home</Link></div>
          <NavDropdown title="DriveBys" className="my-auto mx-auto">
            <Link className="link" to="/table">Table View</Link>
            <Link className="link" to="/map">Map View</Link>
          </NavDropdown>
          <div className="my-auto mx-auto"><Link className="link" to="/users">Users</Link></div>
          <div className="w-100"/>
          <div style={{ textAlign: "end" }}><Link className="link" to="/logout">Logout</Link></div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;