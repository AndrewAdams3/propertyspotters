import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';

import './users.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';

export default function UserProfile(props) {
  const { user, refresh, remove } = props;
  const [Assignments, setAssignments] = useState([]);
  const [DBs, setDBs] = useState([]);
  const [Times, setTimes] = useState([]);
  const width = useInnerWidth();

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

  const Remove = () => {
    remove(user)
      .then(refresh);
  }

  const makeAdmin = () => {
    Axios.put(`${process.env.REACT_APP_SERVER}/data/users/makeAdmin/${user._id}`);
  }

  return (user) ? (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${user.fName}'s Profile`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto", height: "80vh" }}>
          <Container className="h-100 w-100">
            <Row className="h-100">
              <Col lg={9} md={9} sm={12} xs={12}>
                <Container className="h-100">
                  <Row className="h-50" style={{justifyContent: "space-around"}}>
                    <div>
                      <p className="mb-0">Drivebys this month</p>
                      <p className="m-0 text-center">{DBs.length}</p>
                    </div>                    
                    <div>
                      <p className="mb-0">Time clocked this period</p>
                      <p className="m-0 text-center">25 hrs</p> 
                    </div>
                  </Row>
                  <Row className="h-50 text-center" style={{alignItems: "center"}}>
                    <Col lg={4} md={4}>
                      <Button className="w-75">Personal Data</Button>
                    </Col>
                    <Col lg={4} md={4}>
                      <Button className="w-75">Driveby Data</Button>
                    </Col>
                    <Col lg={4} md={4}>
                      <Button className="w-75">Timesheet Data</Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col style={{display: width > 766 ? "none" : "block"}}>
                <Row>
                  <hr width="100%"/>
                </Row>
              </Col>
              <Col lg={3} md={3} sm={12} xs={12} className="p-0" style={{height: width > 766 ? "100%" : "50%" }}>
                <Container className="h-100 w-100 p-0">
                  <Row className="h-100 w-100 mx-auto" style={{flexDirection: "row"}}>
                    <div className="vl" style={width > 760 ? {display: "block", width: "100%" } : {display: "none"}} />
                    <Col xs={2} md={12} className="mx-auto sideButtons">
                      <Button className="w-100" style={{maxWidth: "40vw"}}>Block</Button>
                    </Col>
                    <Col xs={2} md={12} className="mx-auto sideButtons">
                      <Button className="w-100" variant="danger" style={{ maxWidth: "40vw" }} onClick={Remove}>Remove</Button>
                    </Col>
                    <Col xs={2} md={12} className="mx-auto sideButtons">
                      <Button className="w-100" variant="warning" style={{ maxWidth: "40vw" }} onClick={makeAdmin}>Admin</Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
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