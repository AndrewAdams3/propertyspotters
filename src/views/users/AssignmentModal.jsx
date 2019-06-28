import React, {useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

export default function AssignmentModal(props){
  const { user } = props;
  useEffect(() => {
    console.log("user", user);
  },[user])

  return user ? (
    <div>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {user._id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col xs={12} md={8}>
                <Form>
                  <Form.Group controlId="Email">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="" placeholder="address" />
                  </Form.Group>
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