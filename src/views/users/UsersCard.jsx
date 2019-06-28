import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AssignmentModal from './AssignmentModal';

export default function UserCard({Users}){

  const aClick = (id) => {
    console.log("click", id);
    setModalShow(true);
    setActiveId(id);
  }
  const ListItem = ({user}) => {
    return(
      <tr>
        <td>{user.fName}</td>
        <td>{user.lName}</td>
        <td>{user.state}</td>
        <td>{user.city}</td>
        <td style={{maxWidth:"5rem"}}><Button style={{width:"100%"}} onClick={() => aClick(user._id)}>Assignment</Button></td>
      </tr>
    )
  }

  const listHead = () => {
    return(
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
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
                    <ListItem user={user} />
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

  const [modalShow, setModalShow] = useState(false);
  const [activeId, setActiveId] = useState("");

  return(
    <div className="container">
      <AssignmentModal show={modalShow} onHide={() => {setModalShow(false); setActiveId("")}} userId={activeId}/>
      <div className="row">
        <div className="col-12 col-md-8">
          <AllUserCard users={Users} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
            <OnCLockCard users={Users} />
        </div>        
      </div>
    </div>
  )
}