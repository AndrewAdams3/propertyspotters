import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';

import Dropdown from '../../components/Dropdown';

import './users.css';

export default function AssignmentModal(props) {
  const { user, show } = props;
  const [Assignments, setAssignments] = useState([]);
  const [openAll, setOpenAll] = useState(false);
  const [refresh ,setRefresh] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if(user)
      Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/byId/${user._id}`)
        .then(({data}) => {
          setAssignments(data);
        })
  }, [user, del])

  return (user) ? (
    <div>
      <Modal {...props} show={show} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${user.fName}'s Assignment List`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row>
              <Col className="pt-2">
                <Button style={{ width: "40%" }} onClick={() => { setOpenAll(true); setRefresh(!refresh) }}>Open All</Button>
                <Button style={{ width: "40%", position: "absolute", left: "60%" }} onClick={() => { setOpenAll(false); setRefresh(!refresh) }}>Close All</Button>
              </Col>
            </Row>
            <Row className="show-grid mt-3 mx-auto">
              <Col className="mx-auto">
                {Assignments.map((ass) => {
                  let addList = []
                  ass.Addresses.map((add, i)=>{
                    addList.push(add);
                  });
                  return <Dropdown title={new Date(ass.Date).toLocaleDateString()} list={addList} id={ass._id} openState={openAll} complete={ass.completed} refresh={refresh} containerStyle={{width:"100%"}} del={()=>setDel(!del)}/>
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