import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import './users.css';
import Axios from 'axios';

export default function TargetModal(props){
  const { user, onHide } = props;
  const [task, setTask] = useState("");
  const [date, setDate] = useState(new Date());
  const [oldTask, setOldTask] = useState({});
  
  useEffect(()=>{
    if(user)
      Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/target/byId/${user._id}`)
        .then(({data})=>{
          setOldTask(data)
        })
    return () => {
      setOldTask({});
      setTask("");
      setDate();
    }
  }, [user])

  return (user) ? (
    <div>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {user.target ? `Change ${user.fName}'s Target` : `Give ${user.fName} a Target`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                <Form onSubmit={(e)=>e.preventDefault()}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="Date">
                      <Form.Label>Date (defaults to today's date)</Form.Label>
                      <Form.Control type="date" placeholder="date" value={date} onChange={(e)=>setDate(new Date(e.target.value))}/>
                      <small style={{ color: "red" }}>{""}</small>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Target</Form.Label>
                      <Form.Control placeholder="description of target" onChange={(e)=>setTask(e.target.value)}/>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Col>
            </Row>
            <Row>
             <Col>
              <h3>Current Target: {oldTask.area ? oldTask.area : ""}</h3>
             </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "space-around"}}>
          <Button variant="success" type="button" onClick={()=>{props.addTarget(task, date)}}>Add Target</Button>
          <Button onClick={onHide}>Close</Button>
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
            <Button onClick={onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}