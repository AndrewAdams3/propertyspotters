import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AssignmentModal from './AssignmentModal';
import ViewAssignments from './ViewAssignments';

import Axios from 'axios';

export default function UserCard({Users}){

  const aClick = (user) => {
    setModalShow(true);
    setActiveUser(user);
  }
  const vClick = (user) => {
    setViewShow(true);
    setActiveUser(user);
  }
  const ListItem = ({user}) => {
    return(
      <tr id="tRow">
        <td>{user.lName}</td>
        <td>{user.fName}</td>
        <td>{user.state}</td>
        <td>{user.city}</td>
        <td style={{maxWidth:"5rem", textAlign: "center"}}>
          <Button style={{ width: "40%", marginRight: ".2rem" }} onClick={() => aClick(user)}>Add</Button>
          <Button style={{ width: "40%", marginLeft: ".2rem" }} onClick={() => vClick(user)}>View</Button>
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
          <th>Assignment</th>
        </tr>
      </thead>
    )
  }
  const AllUserCard = ({user}) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>All Users</Card.Title>
          <Table striped bordered hover>
            {listHead()}
            <tbody>
              {Users.map((user, index) => {
                return <ListItem user={user} key={index} />
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }
  const OnCLockCard = ({ user }) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Users On Clock</Card.Title>
          <Table striped bordered hover>
            {listHead()}
            <tbody>
              {
                Users.map((user, index) => {
                  return user.isOnClock ? 
                    <ListItem user={user} key={user._id}/>
                  :
                    null
                }) || 
                <tr>
                  <td>{"None"}</td>
                  <td>{"Yet!"}</td>
                </tr>
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }

  const addAssignment =(addList, date) => {
    let ass = []
    for(var i in addList){
      ass[i] = {address: addList[i], completed: false};
    }
    Axios.post(process.env.REACT_APP_SERVER + "/data/assignments/addAssignment", {
      assignment: ass,
      date: date,
      userId: activeUser._id
    }).then(({data}) => {
      console.log(data);
    })
    setModalShow(false); 
    setActiveUser();
  }
  
  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [activeUser, setActiveUser] = useState();

  return(
    <div className="container" style={{overflow: (viewShow || modalShow) ? "hidden" : ""}}>
      <AssignmentModal show={modalShow} onHide={() => {setModalShow(false); setActiveUser()}} addAssignment={addAssignment} user={activeUser}/>
      <ViewAssignments show={viewShow} onHide={() => { setViewShow(false); setActiveUser() }} user={activeUser} />

      <div className="row">
        <div className="col-12 col-lg-8">
          <OnCLockCard users={Users} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-8">
            <AllUserCard users={Users} />
        </div>        
      </div>
    </div>
  )
}