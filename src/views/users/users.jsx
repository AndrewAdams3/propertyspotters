import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';
import UsersCard from './UsersCard';

import './users.css';

const Users = ({match}) => {

  const [{ Users },] = useStateValue();
  const [hasData, setHasData] = useState(true);

  const [users, setUsers] = useState([]);
  useEffect( () => {
    if((Users)){
      setUsers(Users);
      setHasData(true);
    } else{
      setHasData(false);
    }
  }, [Users])

  return hasData ? (
    <div>
      <HeaderNav fixed="top" color="black"/>
      <div className="container main mt-5">
        <UsersCard Users={users}/>
      </div>
    </div>
  ) 
  :
  (null)
}

export default Users;