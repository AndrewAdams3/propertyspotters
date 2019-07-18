import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';

import './users.css';

export default function AssignmentModal(props) {
  const { user } = props;
  const [Assignments, setAssignments] = useState([]);

  useEffect(() => {
    if(user)
      Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/byId/${user._id}`)
        .then(({data}) => {
          setAssignments(data);
        })
  }, [user])

  const ListItem = (ass) => {
    return(
      <div style={{width: "100%"}} key={ass._id}>
        <h3>{new Date(ass.Date).toLocaleDateString()}</h3>
        {ass.Addresses.map((add) => {
          return(<h4 className="pl-5" key={add._id}>{add.address}</h4>)
        })}
      </div>
    )
  }

  return (user) ? (
    <div>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${user.fName}'s Assignment List`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                {Assignments.map((ass) => {
                  return ListItem(ass)
                })}
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