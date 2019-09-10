import React, {useState, useEffect, useContext} from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

import HeaderNav from '../../components/header';
import './table.css';

import { useStateValue } from '../../context/State';
import EditModal from './EditModal';

import { Context, ContextProvider } from './modalContext'

const ListItem = ({db, n}) => {
    const [hover, setHover] = useState("none");

    const edit = require('../../config/images/edit.png');
    let { state, dispatch } = useContext(Context);

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
        </tr>
        </>
    )
}
const TableView = () => {

    const [{ Drivebys },] = useStateValue();
    const [dbs, setDrivebys] = useState([]); 
    const [, sethasDbs] = useState(true);

    useEffect( () => {
        if(Drivebys){
            sethasDbs(true);
        } else{
            sethasDbs(false);
            return;
        }
        let dbs = Drivebys.map((db, n) => {
            db.index = n;
            return <ListItem db={db} n={n} key={db._id} />;
        })
        dbs = dbs.reverse();
        setDrivebys(dbs);
    }, [Drivebys])

    const TableT = ({drivebys}) => {
        return(
            <div className="h-100 mx-1" style={{ marginTop: "3.65rem"}}>
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
                </tr>
            </thead>
            <tbody>
            {drivebys.map((db, index) => {
                return db
            })}
            </tbody>
            </Table>
            </div>
        )
    }
    return  dbs ? (
        <ContextProvider>
            <EditModal/>
            <HeaderNav fixed="top" color={"black"}/> <br/>
            <Container>
                <TableT drivebys={dbs}/>
            </Container>
        </ContextProvider>
  ) : (
    <div>loading...</div>
  )
}

export default TableView;