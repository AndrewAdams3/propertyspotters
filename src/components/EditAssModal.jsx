import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import Axios from 'axios';

export default function EditAssModal(props){
  const { ass, title, subAss, onHide } = props;
  const [Ass, setAss] = useState({});
  const [sass, setSubAss] = useState({})
  const [markCompleted, setMarkCompleted] = useState(false)
  const [toDelete, setDelete] = useState(false);
  const [date, setDate] = useState()
  
  useEffect(()=>{
    Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/one/byId/${ass}`)
    .then(({data})=>{
        if(data){
            setAss(data);
        }
    })
    if(subAss.length){
        Ass.Addresses.map((add)=>{
            if(add._id === subAss){
                setSubAss(add);
            }
        })
    }
  },[ass, subAss])

  return Ass ? (
    <>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" id="editModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {subAss.length ? title + " - " + sass.address : title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                <Form onSubmit={(e)=>e.preventDefault()}>
                  <Form.Row>
                  {!subAss.length &&
                    <Form.Group as={Col} controlId="Date">
                        <Form.Label>Change Due date?</Form.Label>
                        <Form.Control type="date" onChange={(e)=>setDate(e.target.value)}/>
                    </Form.Group>
                  }
                    <Form.Group as={Col} xs={12}>
                      <Form.Label>Mark as Completed?</Form.Label> <br/>
                      <Form.Check type="checkbox" label="yes" inline checked={markCompleted} onChange={()=>setMarkCompleted(true)}/>
                      <Form.Check type="checkbox" label="no" inline checked={!markCompleted} onChange={()=>setMarkCompleted(false)}/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12}>
                      <Form.Label>Delete?</Form.Label> <br/>
                      <Form.Check type="checkbox" label="yes" inline checked={toDelete} onChange={()=>setDelete(true)}/>
                      <Form.Check type="checkbox" label="no" inline checked={!toDelete} onChange={()=>setDelete(false)}/>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "space-around"}}>
          <Button variant="success" type="button">Confirm</Button>
          <Button onClick={onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : 
  (
    <>
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
    </>
  )
}