import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom'
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AssignmentModal from './AssignmentModal';
import TargetModal from './TargetModal';
import ViewAssignments from './ViewAssignments';
import UserProfile from './userProfile';

import Axios from 'axios';

import {useStateValue} from '../../context/State';
import useInnerWidth from '../../components/hooks/useInnerWidth';

export default function UserCard({Users, UsersOnClock, refresh}){

  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const  [taskShow, setTaskShow] = useState(false);
  const [activeUser, setActiveUser] = useState();
  const meRef = useRef(null);
  const meClock = useRef(null);
  const [me, setMe] = useState(null);
  const [me2, setMe2] = useState(null);
  const [{User},] = useStateValue();
  const width = useInnerWidth();


  useEffect(()=>{
    window.scrollTo(0,0);
    setMe( meRef.current ? 
      ReactDOM
      .findDOMNode(meRef.current)
      .getBoundingClientRect() : null
    )
    setMe2(meClock.current ?
      ReactDOM
        .findDOMNode(meClock.current)
        .getBoundingClientRect() : null
    )
  }, [])


  const aClick = (user) => {
    setModalShow(true);
    setActiveUser(user);
  }
  const vClick = (user) => {
    setViewShow(true);
    setActiveUser(user);
  }
  const pClick = (user) => {
    setProfileShow(true);
    setActiveUser(user);
  }
  const tClick = (user) => {
    setTaskShow(true)
    setActiveUser(user)
  }

  const ListItem = ({user, refVal}) => {
    return(
      <tr id="tRow" ref={user._id === User._id ? refVal : null}>
        <td>{user.lName}</td>
        <td>{user.fName}</td>
        <td>{user.state}</td>
        <td>{user.city}</td>
        <td className="row m-auto" style={{maxWidth:"100%", textAlign: "center", border: "none"}}>
          <Button style={{ width: "40%", margin: ".1rem" }} className="col-12 col-md-5" onClick={() => aClick(user)}>Add</Button>
          <Button style={{ width: "40%", margin: ".1rem" }} className="col-12 col-md-5" onClick={() => vClick(user)}>View</Button>
        </td>
        <td><Button style={{maxWidth: "7rem", textAlign: "center"}} onClick={()=>{tClick(user)}}>Targets</Button></td>
        <td style={{ maxWidth: "6rem", textAlign: "center" }}>
          <Button style={{ maxWidth: "100%" }} onClick={() => pClick(user)}>View</Button>
        </td>
      </tr>
    )
  }

  const listHead = () => {
    return(
      <thead>
        <tr>
          <th>Last Name</th>
          <th>First Name</th>
          <th>State</th>
          <th>City</th>
          <th>Assignments</th>
          <th>Targets</th>
          <th>View Profile</th>
        </tr>
      </thead>
    )
  }
  const UserCard = ({users, title, refVal}) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title className="text-center">{title}</Card.Title>
          <Table striped hover responsive>
            {listHead()}
            <tbody>
              {users.map((user, index) => {
                return <ListItem user={user} key={index} refVal={refVal} />
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }
  
  const addAssignment =(addList, date, notes) => {
    let ass = []
    for(var i in addList){
      ass[i] = {address: addList[i].trim(), completed: false};
    }
    console.log("date: ", date)
    var d = new Date(date);
    d.setDate(d.getDate()+1)
    Axios.post(process.env.REACT_APP_SERVER + "/data/assignments/addAssignment", {
      assignment: ass,
      date: d,
      notes: notes,
      userId: activeUser._id
    }).then(({data}) => {
      console.log(data);
    })
    setModalShow(false); 
    setActiveUser();
  }

  const addTarget = (target, date) => {
    if(!date) date = new Date();
    Axios.post(`${process.env.REACT_APP_SERVER}/data/assignments/addtarget/${activeUser._id}`, {
      target: target,
      date: date
    })
    setTaskShow(false)
    setActiveUser()
  }

  const Remove = async (user) => {
    setActiveUser();
    setProfileShow(false); 
    await Axios.delete(`${process.env.REACT_APP_SERVER}/data/users/byId/${user._id}`);
  }


  return(
    
    <div className="container" style={{overflow: (viewShow || modalShow) ? "hidden" : ""}}>
      {/* {me && width > 768 && <div id="me_id" style={{ top: me.top + (me.height/4), left: me.left / 2, height: me.height/2, width: me.height }}><p className="me">You -></p></div>}
      {me2 && width > 768 && <div id="me_id" style={{ top: me2.top + (me2.height / 4), left: me2.left / 2, height: me2.height / 2, width: me2.height }}><p className="me">You -></p></div>} */}
      <AssignmentModal show={modalShow} user={activeUser} onHide={() => {setModalShow(false); setActiveUser()}} addAssignment={addAssignment} />
      <TargetModal show={taskShow} user={activeUser} onHide={() => {setTaskShow(false); setActiveUser()}} addTarget={addTarget} />
      <ViewAssignments show={viewShow} user={activeUser} onHide={() => { setViewShow(false); setActiveUser() }} />
      <UserProfile show={profileShow} user={activeUser} onHide={() => { setProfileShow(false); setActiveUser() }} remove={Remove} refresh={refresh} />
      <div className="row" style={{justifyContent: "center"}}>
        <div className="col-12 col-lg-12">
          <UserCard users={UsersOnClock} title={"On Clock"} refVal={meClock} />
        </div>
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="col-12 col-lg-12">
          <UserCard users={Users} title="All Users" refVal={meRef} />
        </div>        
      </div>
      </div>
  )
}