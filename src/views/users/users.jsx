import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';
import UsersCard from './UsersCard';
import './users.css';
import useUsers from '../../components/hooks/useUsers';

const Users = () => {

  const [{ socket },] = useStateValue();
  const [hasData, setHasData] = useState(false);

  const Users = useUsers();
  
  useEffect( () => {
    if((Users)){
      setHasData(true);
    } else{
      setHasData(false);
    }
  }, [Users])

  return hasData ? (
    <div>
      <HeaderNav fixed="top" color="black"/>
      <div className="container mainView">
        <UsersCard Users={Users}/>
      </div>
    </div>
  ) 
  :
  (null)
}

export default Users;