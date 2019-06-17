import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';

import {ServerAdd} from '../../config/constants';

const ListItem = ({db, n}) => {
  console.log(n);
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

const TableView = (props) => {

  const [drivebys, setDrivebys] = useState([]); 

  useEffect( () => {
    Axios.get(ServerAdd + "/data/drivebys/all")
      .then( ({data}) => {
        if(data.response === 0){
          console.log("ok");
          let dbs = data.docs.map( (db, n) => {
            return <ListItem db={db} n={n} />;
          })
          setDrivebys(dbs);
          console.log(data.docs[0]);
        }
        else{
          console.log("err");
        }
      })
  }, [])

  return  drivebys ? (
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
        {drivebys.reverse().map( (db, index) => {
          return(db);
        })}
      </tbody>
    </Table>
  ) : (
    <div>loading...</div>
  )
}

export default TableView;