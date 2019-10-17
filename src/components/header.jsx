import React, {useState, useRef, useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import './component.css';

import { useStateValue } from '../context/State';
import useInnerWidth from './hooks/useInnerWidth';
import useDbs from './hooks/useDbs';

const Header = ({fixed, color}) => {

  const [{userId},] = useStateValue();
  const [small, setSmall] = useState(false);
  const cRef = useRef();
  const width = useInnerWidth();
  const Drivebys = useDbs()

  useEffect(()=>{
    width < 1000 ? setSmall(true) : setSmall(false);
  }, [width])

  return (
    <Navbar expand="lg" bg={color==="black" ? "dark" : "transparent"} fixed={fixed} id="nav" style={{zIndex:10}}>
      <Navbar.Brand><Link className="link" to="/home">VaroAdmin</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" ref={cRef}/>
      <Navbar.Collapse id="basic-navbar-nav" style={{marginTop: small ? "3rem" : 0, maxWidth: "100%", textAlign: "right"}}>
        <Nav className="mr-auto w-100" style={{maxWidth: "100%", marginTop: small ? "2rem" : 0, alignItems: small ? "flex-end" : "center"}}>
          {
            userId &&
                <NavDropdown title="DriveBys" className="my-auto" style={{ maxWidth: "100%", textAlign: "right"}} id="ddTitle">
                  <Link className="link" to="/table" style={{ color: "black", textAlign:  "center" }}>Table View</Link>
                  <Link className="link" to="/map" style={{ color: "black", textAlign: "center" }}>Map View</Link>
                  <Link className="link" to="/chart" style={{color: "black", textAlign: "center" }}>Chart View</Link>
                </NavDropdown>
          }
          {
            userId && 
            <div className="my-auto" style={{ marginRight: "1.5rem" }}><Link className="link" to="/users">Users</Link></div>
          }
          <div className="dbstats" style={{marginRight: small ? 0 : "5rem", paddingRight: '2rem'}}>
            {
              userId && Drivebys &&
              <>
                <p style={{color: "white", width: "20rem", margin: "auto"}}>{"Total Drivebys: " + Drivebys.length}</p>
                <p style={{color: "white", width: "20rem", margin: "auto"}}>{"Today's Drivebys: " + Drivebys.filter((db, i)=> new Date(db.date).toLocaleDateString() === new Date().toLocaleDateString()).length}</p>
                {/* <Button variant="success" onClick={refresh} style={{width:"15rem", marginLeft: "1rem"}}>{loading ? "Loading..." : "Refresh Data"}</Button> */}
              </>
            }
          </div>
          <div style={{ marginRight: "1.5rem", position: "absolute", right: small ? 0 : "5rem", top: small ? "6rem" : "1rem"}}><Link className="link" to={"/login"} >{"Login"}</Link></div>
          <div style={{ marginRight: "1.5rem", position: "absolute", right: 0, top: small ? "4rem" : "1rem" }}><Link className="link" to={userId ? "/logout" : "/signup"}>{userId ? "Logout" : "Signup"}</Link></div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;