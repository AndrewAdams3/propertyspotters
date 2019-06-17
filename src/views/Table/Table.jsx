import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import HeaderNav from '../../components/header';
import {ServerAdd} from '../../config/constants';

const ListItem = ({db, n}) => {
  return(
    <tr>
      <td>{n + 1}</td>
      <td>{db.date}</td>
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
  )
}

const TableView = () => {

  const handleClick = (change) => {
    console.log(bIndex, "-", eIndex);
    if(eIndex + change < 0 ){
      setEIndex(0);
      setBIndex(Math.abs(change));
      return;
    } 
    if(bIndex + change > drivebys.length) {
      setBIndex(drivebys.length);
      setEIndex(drivebys.length-change);
      return;
    }
      setBIndex(bIndex + change)
      setEIndex(eIndex + change)
  }

  const [drivebys, setDrivebys] = useState([]); 
  const [bIndex, setBIndex] = useState(0);
  const [eIndex, setEIndex] = useState(0);

  useEffect( () => {
    Axios.get(ServerAdd + "/data/drivebys/all")
      .then( ({data}) => {
        if(data.response === 0){
          let dbs = data.docs.map( (db, n) => {
            db.index = n;
            return <ListItem db={db} n={n} />;
          })
          dbs = dbs.reverse();
          console.log("total length: ", dbs.length);
          setDrivebys(dbs);
          setBIndex(dbs.length);
          setEIndex(dbs.length-20);
        }
        else{
          console.log("err");
        }
      })
  }, [])
  console.log("starting indeces: ", bIndex, eIndex)
  return  drivebys ? (
    <div>
      <HeaderNav fixed="top"/>
      <TableT drivebys={drivebys.map( (db, index) => {
        console.log(db.index);
        if(db.props.n <= bIndex && db.props.n >= eIndex) return db;
        else return null;
      })} bIndex={bIndex} eIndex={eIndex} />
      <div class="text-center pb-3">
        <Button style={{ marginRight: "20vh" }} variant="primary" onClick={() => handleClick(20)}>{"<"}</Button>
        <Button style={{ marginLeft: "20vh" }} variant="primary" onClick={() => handleClick(-20)}>{">"}</Button>
      </div>
    </div>
  ) : (
    <div>loading...</div>
  )
}

export default TableView;