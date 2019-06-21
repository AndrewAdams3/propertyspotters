import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

export default function UserCard({Users}){

  const ListItem = ({user}) => {
    return(
      <tr>
        <td>{user.fName}</td>
        <td>{user.lName}</td>
      </tr>
    )
  }

  const AllUserCard = ({user}) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>All Users</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
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
          <Card.Title>All Users</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user, index) => {
                return user.isOnClock ? 
                  <ListItem user={user} />
                :
                  null
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }

  return(
    <div>
      <AllUserCard users={Users} />
      <OnCLockCard users={Users} />
    </div>
  )
}