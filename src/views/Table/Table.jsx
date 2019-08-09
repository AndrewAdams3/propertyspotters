import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import HeaderNav from '../../components/header';
import './table.css';

import { useStateValue } from '../../context/State';

const ListItem = ({db, n}) => {
  return(
    <tr>
      <td>{n + 1}</td>
      <td>{new Date(db.date).toLocaleDateString()}</td>
      <td style={{maxWidth: "15vw"}}>{db.address}</td>
      <td>{<a href={db.picturePath} target="_blank" rel="noopener noreferrer">Link</a>}</td>
      <td>{db.type}</td>
      <td>{db.vacant ? "vacant" : "not vacant"}</td>
      <td>{db.burned ? "burned" : "not burned"}</td>
      <td>{db.boarded ? "boarded" : "not boarded"}</td>
    </tr>
  )
}

const TableT = ({drivebys, bIndex, eIndex}) => {
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

const TableView = () => {

  const handleClick = (change) => {
    if(eIndex + change < 0 ){
      setEIndex(0);
      setBIndex(Math.abs(change));
      window.scrollTo(0, 0)
      return;
    } 
    if(bIndex + change > dbs.length) {
      setBIndex(dbs.length);
      setEIndex(dbs.length-change);
      window.scrollTo(0, 0)
      return;
    }
      setBIndex(bIndex + change)
      setEIndex(eIndex + change)
    window.scrollTo(0, 0)
  }
  const [{ Drivebys },] = useStateValue();

  const [dbs, setDrivebys] = useState([]); 
  const [, sethasDbs] = useState(true);
  const [bIndex, setBIndex] = useState(0);
  const [eIndex, setEIndex] = useState(0);

  useEffect( () => {
    if(Drivebys){
      sethasDbs(true);
    } else{
      sethasDbs(false);
      return;
    }
    let dbs = Drivebys.map((db, n) => {
      db.index = n;
      return <ListItem db={db} n={n} />;
    })
    dbs = dbs.reverse();
    setDrivebys(dbs);
    setBIndex(dbs.length);
    setEIndex(dbs.length - 20);
  }, [Drivebys])

  return  dbs ? (
    <div>
      <HeaderNav fixed="top" color={"black"}/> <br/>
      <TableT drivebys={dbs.map( (db, index) => {
        if(db.props.n <= bIndex && db.props.n >= eIndex) return db;
        else return null;
      })} bIndex={bIndex} eIndex={eIndex} />
      <div className="text-center pb-3">
        <Button className="col-3 col-lg-4 tableRButton"  style={{maxWidth: "25vh"}} variant="primary" onClick={() => handleClick(20)}>{"<"}</Button>
        <Button className="col-3 col-lg-4 tableLButton" style={{ maxWidth: "25vh" }} variant="primary" onClick={() => handleClick(-20)}>{">"}</Button>
      </div>
    </div>
  ) : (
    <div>loading...</div>
  )
}

export default TableView;