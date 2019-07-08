import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import './users.css';

export default function AssignmentModal(props){
  const { user } = props;
  const [AddressList, setAddressList] = useState([]);
  const [enter, setEnter] = useState(false);
  const [currentAdd, setCurrentAdd] = useState("");
  const [date, setDate] = useState();


  useEffect(() => {
    console.log("effect",AddressList)
    return () =>{
      setAddressList([]);
      setCurrentAdd();
      setDate();
    }
  },[user])

  const newAdd = (e) => {
    if(e.key==="Enter"){
      setAddressList([
        ...AddressList,
        currentAdd
      ]);
      setCurrentAdd("");
      setEnter(false);
    }
  }

  return (user) ? (
    <div>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`Give ${user.fName} an Assignment`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                <Form onSubmit={(e)=>e.preventDefault()}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="Date">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control type="date" placeholder="date" onChange={(e)=>setDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Addresses</Form.Label>
                      <Form.Control placeholder="address" value={currentAdd} onChange={(e) => setCurrentAdd(e.target.value)} onKeyPress={(e)=>{newAdd(e)}}/>
                      <small style={{color: "red"}}>{enter ? "Please Press Enter" : ""}</small>
                    </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group>
                        {AddressList.map((add, index) => {
                          return <h4>{`Address ${index+1}: ${add}`}</h4>
                        })}
                      </Form.Group>
                  </Form.Row>
                  <Button className="mb-2" variant="success" type="button" onClick={() => currentAdd.length > 0 ? setEnter(true) : props.addAssignment(AddressList, date)}>Add Assignment</Button>
                </Form>
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