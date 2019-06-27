import React, {useEffect, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import './component.css';


import { useStateValue } from '../context/State';

const Header = ({fixed, color}) => {
  const [Color,] = useState(color);
  useEffect( () => {
    console.log("test", Color);
    if (Color === "white") {
      require('./linkColors/white.css');
      
    } else {
      require('./linkColors/black.css');
    }
  },[Color])
  const [{userId},] = useStateValue();
  return (
    <Navbar expand="lg" bg={"transparent"} fixed={fixed} id="nav" style={{zIndex:10}}>
      <Navbar.Brand><Link className="link" to="/home" style={{color: color}}>PropertySpotters</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto w-100">
          {
            userId &&
                <NavDropdown title="DriveBys" className="my-auto ml-auto" style={{ marginRight: "1.5rem"}} id="ddTitle">
                  <Link className="link" to="/table" style={{ color: "black" }}>Table View</Link>
                  <Link className="link" to="/map" style={{ color: "black" }}>Map View</Link>
                </NavDropdown>
          }
          {
            userId && 
            <div className="my-auto ml-auto" style={{ marginRight: "1.5rem" }}><Link className="link" to="/users" style={{ color: color }}>Users</Link></div>
          }
          <div className="w-100"/>
          <div style={{ textAlign: "end", marginRight: "1.5rem" }}><Link className="link" to="/login" style={{ color: color }}>Login</Link></div>
          <div style={{ textAlign: "end", marginRight: "1.5rem" }}><Link className="link" to="/logout" style={{ color: color }}>Logout</Link></div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;