import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';

import './users.css';

export default function UserProfile(props) {
  const { user } = props;
  const [Assignments, setAssignments] = useState([]);
  const [DBs, setDBs] = useState([]);
  const [Times, setTimes] = useState([]);

  useEffect(() => {
    if (user){
      Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/byId/${user._id}`)
        .then(({ data }) => {
          setAssignments(data);
          Axios.post(`${process.env.REACT_APP_SERVER}/data/drivebys/byUserId`, {
            id: user._id,
            sort: "-date",
            limit: 30
          })
            .then(({ data }) => {
              setDBs(data.docs);
            })
            .then(()=>{
              Axios.get(`${process.env.REACT_APP_SERVER}/data/times/byId/${user._id}/${30}`)
                .then(({data})=>{
                  console.log("data", data);
                  setTimes(data);
                })
                .catch((err)=>console.error(err));
            })
            .catch((err)=>console.error(err));
        })
        .catch((err)=>console.error(err));
    }
  }, [user])

  return (user) ? (
    <div>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${user.fName}'s Profile`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                <p>
                  {`${user.fName} has put in ${DBs.length} drivebys`}
                </p>
              </Col>
              <Col>
                <ul>
                  {(DBs || []).map((db, i)=> {
                    return(
                      <li>{db.address}</li>
                    )
                  })}
                </ul>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {`${user.fName} has clocked in ${Times.length} times`}
                </p>
              </Col>
              <Col>
                <ul>
                  {(Times || []).map((time, i) => {
                    return (
                      <li>{time._id}</li>
                    )
                  })}
                </ul>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {`${user.fName} has had ${Assignments.length} assignments`}
                </p>
              </Col>
              <Col>
                <ul>
                  {(Assignments || []).map((ass, i) => {
                    return (
                      <li>
                        <ul>
                          {ass.Addresses.map((add)=>{
                            return <li>{`${add.address} was ${add.completed ? "completed" : "not completed"}`}</li>
                          })}
                        </ul>
                      </li>
                    )
                  })}
                </ul>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) :
    (
      <div>
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Loading
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row className="show-grid">
                <Col xs={12} md={8}>
                  Waiting for user data...
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}