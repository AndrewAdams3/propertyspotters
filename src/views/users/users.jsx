import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';
import UsersCard from './UsersCard';
import { populateData } from '../../helpers/data';

import './users.css';

const Users = ({match}) => {

  const [{ Users },] = useStateValue();
  const [, usersDispatch] = useStateValue();
  const [hasData, setHasData] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersOnClock, setUsersOnClock] = useState([]);
  

  useEffect( () => {
    if((Users)){
      setUsers(Users);
      setUsersOnClock(Users.filter((user, i)=>{return user.isOnClock}))
      setHasData(true);
    } else{
      setHasData(false);
    }
  }, [Users])

  const Refresh = async () => {
    const dts = await populateData();
    usersDispatch({
      type: 'users',
      value: dts.u
    })
    console.log("new users", dts.u)
    setUsers(dts.u);
    setUsersOnClock(dts.u.filter((user, i) => { return user.isOnClock }))
  }

  return hasData ? (
    <div>
      <HeaderNav fixed="top" color="black"/>
      <div className="container mainView">
        <UsersCard Users={users} UsersOnClock={usersOnClock} refresh={Refresh}/>
      </div>
    </div>
  ) 
  :
  (null)
}

export default Users;