import React, {useState, useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import './component.css';

import { useStateValue } from '../context/State';

const Header = ({fixed, color, opacity}) => {

  const [{userId, Drivebys, User},] = useStateValue();


  return (
    <Navbar expand="lg" bg={color==="black" ? "dark" : "transparent"} fixed={fixed} id="nav" style={{zIndex:10}}>
      <Navbar.Brand><Link className="link" to="/home">VaroAdmin</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto w-100">
          {
            userId &&
                <NavDropdown title="DriveBys" className="my-auto ml-auto" style={{ marginRight: "1.5rem"}} id="ddTitle">
                  <Link className="link" to="/table" style={{ color: "black" }}>Table View</Link>
                  <Link className="link" to="/map" style={{ color: "black" }}>Map View</Link>
                  <Link className="link" to="/chart" style={{color: "black"}}>Chart View</Link>
                </NavDropdown>
          }
          {
            userId && 
            <div className="my-auto ml-auto" style={{ marginRight: "1.5rem" }}><Link className="link" to="/users">Users</Link></div>
          }
          <div className="w-50"/>
          {
            userId && Drivebys &&
            <>
              <p style={{color: "white", width: "20rem", marginTop: ".5rem"}}>{"Total Drivebys: " + Drivebys.length}</p>
              <p style={{color: "white", width: "20rem", marginTop: ".5rem"}}>{"Today's Drivebys: " + Drivebys.filter((db, i)=> new Date(db.dateFound).toLocaleDateString() === new Date().toLocaleDateString()).length}</p>
            </>
          }
          <div className="w-50"/>
          <div style={{ textAlign: "end", marginRight: "1.5rem" }}><Link className="link" to={"/login"} >{"Login"}</Link></div>
          <div style={{ textAlign: "end", marginRight: "1.5rem" }}><Link className="link" to={userId ? "/logout" : "/signup"}>{userId ? "Logout" : "Signup"}</Link></div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;