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
  const [noDate, setNoDate] = useState(false);

  useEffect(() => {
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

  const validate = () => {
    if(date){
      setNoDate(false);
      if (currentAdd.length > 0){
        setEnter(true)
      } else{
        props.addAssignment(AddressList, date)
      }
    } else{
      setNoDate(true);
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
                      <small style={{ color: "red" }}>{noDate ? "Please Enter a Date" : ""}</small>
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
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "space-around"}}>
          <Button variant="success" type="button" onClick={validate}>Add Assignment</Button>
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