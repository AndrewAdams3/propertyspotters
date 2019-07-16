import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';
import useWidth from '../../components/hooks/useInnerWidth';

import './users.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';

export default function UserProfile(props) {
  const { user } = props;
  const [Assignments, setAssignments] = useState([]);
  const [DBs, setDBs] = useState([]);
  const [Times, setTimes] = useState([]);
  const width = useInnerWidth();

  useEffect(() => {
    if (user){
      console.log("pic", user.profilePic);
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
                <Container className="h-50">
                  <Row className="h-100" style={{justifyContent: "space-around"}}>
                    <div className="profilePicContainer" style={{display: width > 750 ? "block" : "none"}}>
                      <img className="profilePic" src={`${process.env.REACT_APP_SERVER}/${user.profilePic}`} alt=""/>
                    </div>
                    <div>
                      <p className="mb-0">Drivebys this month</p>
                      <p className="m-0 text-center">5</p>
                    </div>                    <div>
                      <p className="mb-0">Time clocked this period</p>
                      <p className="m-0 text-center">25 hrs</p> 
                    </div>
                  </Row>
                  <Row className="h-50 text-center" style={{alignItems: "center"}}>
                    <Col lg={6} md={6}>
                      <Button className="w-75">View Driveby Data</Button>
                    </Col>
                    <Col lg={6} md={6}>
                      <Button className="w-75">View Timesheet Data</Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col lg={3} md={3} sm={12} xs={12} className="p-0" style={{height: width > 766 ? "100%" : "50%" }}>
                <Container className="h-100 w-100 p-0">
                  <Row className="h-100 w-100 mx-auto" style={{flexDirection: "column", justifyContent: "space-around"}}>
                    <div className="vl" style={width > 760 ? {display: "block", width: "100%" } : {display: "none"}} />
                    <Col xs={2} className="mx-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%" }}>
                      <Button className="w-100" style={{maxWidth: "40vw"}}>Block</Button>
                    </Col>
                    <Col xs={2} className="mx-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%" }}>
                      <Button className="w-100" variant="danger" style={{ maxWidth: "40vw" }}>Remove</Button>
                    </Col>
                    <Col xs={2} className="mx-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: "100%" }}>
                      <Button className="w-100" variant="warning" style={{ maxWidth: "40vw" }}>Admin</Button>
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