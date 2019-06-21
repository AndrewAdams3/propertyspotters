import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';
import UsersCard from './UsersCard';

const Users = ({match}) => {
  console.log("user match: ", match);

  const [{ Users }, userDispatch] = useStateValue();

  const [users, setUsers] = useState([]);
  console.log("in users");
  useEffect( () => {
    setUsers(Users);
  }, [])

  return(
    <div>
      <HeaderNav />
      <div className="container">
        <div className="row">
          <div className="col">
            <UsersCard Users={users}/>
          </div>
          <div className="col">
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users;