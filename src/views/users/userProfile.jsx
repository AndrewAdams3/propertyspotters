import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Axios from 'axios';

import './users.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';
import ConfirmModal from '../../components/ConfirmModal';
import DataPage from '../../components/DataPage';
import TimeSheetView from './TimeSheetView';
import DBView from './DBView';
import PersonalView from './PersonalView';

export default function UserProfile(props) {
  const { user, refresh, remove, show } = props;
  const [Assignments, setAssignments] = useState([]);
  const [DBs, setDBs] = useState([]);
  const [Times, setTimes] = useState([]);
  const [TotalTime, setTotalTime] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [todo, setTodo] = useState("");
  const width = useInnerWidth();
  const [DataShow, setDataShow] = useState(false);
  const [DataTitle, setDataTitle] = useState("")
  const [DataBody, setDataBody] = useState();

  const MSperH = (60 * 60 * 1000);

  useEffect(() => {
    if (user){
      Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/byId/${user._id}`)
      .then(({ data }) => {
        setAssignments(data);
      })
      Axios.post(`${process.env.REACT_APP_SERVER}/data/drivebys/byUserId`, {
        id: user._id,
        sort: "-date",
        limit: 30
      })
      .then(({ data }) => {
        setDBs(data.docs);
      })
      Axios.get(`${process.env.REACT_APP_SERVER}/data/times/byId/${user._id}/${100}`)
        .then(({ data }) => {
          setTotalTime((data.reduce((total, curr) => { return total + curr.totalTime }, 0) / MSperH).toFixed(3));
          setTimes(data);
        })
    }
  }, [user])

  const Remove = () => {
    remove(user)
      .then(()=>{
        setConfirm(false);
        refresh();
      });
  }

  const makeAdmin = (val) => {
    user.admin = val;
    Axios.put(`${process.env.REACT_APP_SERVER}/data/users/makeAdmin/${user._id}/${val}`)
      .then(()=>{
        setConfirm(false);
        refresh();
      });
  }

  const setAction = (action) => {
    setTodo(action);
    setConfirm(true);
  }

  const doAction = () => {
    switch (todo) {
      case "remove":
        Remove();
        break;
      case "admin":
        makeAdmin(!user.admin);
        break;
      default:
        break;
    }
  }

  const moreData = (title, DataView, data) => {
    setDataTitle(title);
    setDataBody(<DataView data={data} user={user}/>);
    setDataShow(true);
  }

  return (user) ? (
    <div>
      <ConfirmModal show={confirm} close={() => setConfirm(false)} yes={doAction} no={() => setConfirm(false)}/>
      <DataPage 
        title={DataTitle}
        body={DataBody}
        onHide={()=>setDataShow(false)}
        show={DataShow}
      />
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${user.fName}'s Profile`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto", maxHeight: "65vh" }}>
          <Container className="h-100 w-100">
            <Row className="h-100">
              <Col lg={9} md={9} sm={12} xs={12}>
                <Container className="h-100">
                  <Row className="h-50" style={{justifyContent: "space-around"}}>
                    <div>
                      <p className="mb-0">Total Drivebys</p>
                      <p className="m-0 text-center">{DBs.length}</p>
                    </div>                    
                    <div>
                      <p className="mb-0">Total Time clocked</p>
                      <p className="m-0 text-center">{TotalTime} hrs</p> 
                    </div>
                  </Row>
                  <Row className="h-50 text-center" style={{alignItems: "center"}}>
                    <Col lg={4} md={4}>
                      <Button className="w-75" onClick={()=>moreData("Personal Data", PersonalView)}>Personal Data</Button>
                    </Col>
                    <Col lg={4} md={4}>
                      <Button className="w-75" onClick={()=>moreData("DriveBys", DBView, DBs)}>Driveby Data</Button>
                    </Col>
                    <Col lg={4} md={4}>
                      <Button className="w-75" onClick={()=>moreData("TimeSheet", TimeSheetView, Times)}>Timesheet Data</Button>
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
                      <Button className="w-100" style={{maxWidth: "40vw"}} onClick={()=>{setConfirm(true)}}>Block User</Button>
                    </Col>
                    <Col xs={2} md={12} className="mx-auto sideButtons">
                      <Button className="w-100" variant="danger" style={{ maxWidth: "40vw" }} onClick={()=>{setAction("remove")}}>Remove User</Button>
                    </Col>
                    <Col xs={2} md={12} className="mx-auto sideButtons">
                      <Button className="w-100" variant="warning" style={{ maxWidth: "40vw" }} onClick={() => setAction("admin")}>{user.admin ? "Remove Admin" : "Make Admin"}</Button>
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