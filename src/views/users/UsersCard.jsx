import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AssignmentModal from './AssignmentModal';
import ViewAssignments from './ViewAssignments';
import UserProfile from './userProfile';

import Axios from 'axios';

export default function UserCard({Users, UsersOnClock, refresh}){

  const [modalShow, setModalShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const [activeUser, setActiveUser] = useState();

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

  const ListItem = ({user}) => {
    return(
      <tr id="tRow">
        <td>{user.lName}</td>
        <td>{user.fName}</td>
        <td>{user.state}</td>
        <td>{user.city}</td>
        <td className="row m-auto" style={{maxWidth:"100%", textAlign: "center", border: "none"}}>
          <Button style={{ width: "40%", margin: ".1rem" }} className="col-12 col-md-5" onClick={() => aClick(user)}>Add</Button>
          <Button style={{ width: "40%", margin: ".1rem" }} className="col-12 col-md-5" onClick={() => vClick(user)}>View</Button>
        </td>
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
          <th>View Stats</th>
        </tr>
      </thead>
    )
  }
  const UserCard = ({users, title}) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title className="text-center">{title}</Card.Title>
          <Table striped hover responsive>
            {listHead()}
            <tbody>
              {users.map((user, index) => {
                return <ListItem user={user} key={index} />
              })}
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

  const Remove = async (user) => {
    setActiveUser();
    setProfileShow(false); 
    await Axios.delete(`${process.env.REACT_APP_SERVER}/data/users/byId/${user._id}`);
  }

  return(
    <div className="container" style={{overflow: (viewShow || modalShow) ? "hidden" : ""}}>
      <AssignmentModal show={modalShow} user={activeUser} onHide={() => {setModalShow(false); setActiveUser()}} addAssignment={addAssignment} />
      <ViewAssignments show={viewShow} user={activeUser} onHide={() => { setViewShow(false); setActiveUser() }} />
      <UserProfile show={profileShow} user={activeUser} onHide={() => { setProfileShow(false); setActiveUser() }} remove={Remove} refresh={refresh} />

      <div className="row" style={{justifyContent: "center"}}>
        <div className="col-12 col-lg-8">
          <UserCard users={UsersOnClock} title={"On Clock"} />
        </div>
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="col-12 col-lg-8">
            <UserCard users={Users} title="All Users" />
        </div>        
      </div>
    </div>
  )
}