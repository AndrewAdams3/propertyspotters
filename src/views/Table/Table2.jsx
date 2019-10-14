import React, {useState, useEffect, useContext} from 'react';
import Table from 'react-bootstrap/Table';
import {Container, Row, Col, Card} from 'react-bootstrap';

import HeaderNav from '../../components/header';
import './table.css';

import { useStateValue } from '../../context/State';
import EditModal from './EditModal';

import { Context, ContextProvider } from './modalContext'
import useDbs from '../../components/hooks/useDbs';

const ListItem = ({db, n}) => {
    const [hover, setHover] = useState("none");

    const edit = require('../../config/images/edit.png');
    let dispatch = useContext(Context).dispatch;

    const handleClick = (field, val) => {
        dispatch({type: "field", value: {name: field, value: val}})
        dispatch({type: "db", value: db})
        dispatch({type: "show", value: true})
    }
    return(
        <>
        <tr>
            <td><span className="tspan">{n + 1}</span></td>
            <td><span className="tspan">{new Date(db.date).toLocaleDateString()}</span></td>
            <td style={{maxWidth: "15vw"}} onMouseEnter={()=>setHover("add")} onMouseLeave={()=>setHover("none")}>
                <span className="tspan">{db.address}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==="add" ? "flex" : "none"}} onClick={()=>handleClick("address", db.address)}/>
            </td>
            <td>
                <span className="tspan">
                    <a href={db.picturePath} target="_blank" rel="noopener noreferrer">Link</a>
                </span>
            </td>
            <td onMouseEnter={()=>setHover("type")} onMouseLeave={()=>setHover("none")}>
                <span className="tspan">{db.type}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==="type" ? "flex" : "none"}} onClick={()=>handleClick("type", db.type)}/>
            </td>
            <td onMouseEnter={()=>setHover("vac")} onMouseLeave={()=>setHover("none")}>
                <span className="tspan">{db.vacant ? "vacant" : "not vacant"}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==="vac" ? "flex" : "none"}} onClick={()=>handleClick("vacant", db.vacant)}/>
            </td>
            <td onMouseEnter={()=>setHover("burn")} onMouseLeave={()=>setHover("none")}>
                <span className="tspan">{db.burned ? "burned" : "not burned"}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==="burn" ? "flex" : "none"}} onClick={()=>handleClick("burned", db.burned)}/>
            </td>
            <td onMouseEnter={()=>setHover("board")} onMouseLeave={()=>setHover("none")}>
                <span className="tspan">{db.boarded ? "boarded" : "not boarded"}</span>
                <img src={edit} alt="edit" className="edit-icon" style={{display: hover==="board" ? "flex" : "none"}} onClick={()=>handleClick("boarded", db.boarded)}/>
            </td>
            <td>
                {db.latitude}
            </td>
            <td>
                {db.longitude}
            </td>
        </tr>
        </>
    )
}
const TableView = () => {

    const Drivebys = useDbs();

    const TableT = ({drivebys}) => {
        return(
            <div className="h-100 mx-1 w-100" style={{ marginTop: "3.65rem"}}>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Number</th>
                <th>Date</th>
                <th>Address</th>
                <th>Picture</th>
                <th>Type</th>
                <th>Vacant?</th>
                <th>Burned?</th>
                <th>Boarded?</th>
                <th>Latitude</th>
                <th>Longitude</th>
                </tr>
            </thead>
            <tbody>
            {drivebys.map((db, index) => {
                return <ListItem db={db} n={index} key={db._id} />
            }).reverse()}
            </tbody>
            </Table>
            </div>
        )
    }
    return  Drivebys ? (
        <ContextProvider>
            <EditModal/>
            <HeaderNav fixed="top" color={"black"} dbsN={Drivebys.length
            }/> <br/>
            <Container  style={{overflowX: "scroll"}}>
                <Row>
                    <Col xs={12}>
                        <TableT drivebys={Drivebys}/>   
                    </Col>
                </Row>
            </Container>
        </ContextProvider>
  ) : (
    <div>loading...</div>
  )
}

export default TableView;