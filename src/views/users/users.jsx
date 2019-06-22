import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';
import UsersCard from './UsersCard';

const Users = ({match}) => {
  console.log("user match: ", match);

  const [{ Users }, userDispatch] = useStateValue();
  const [hasData, setHasData] = useState(true);

  const [users, setUsers] = useState([]);
  console.log("in users");
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
  :
  (null)
}

export default Users;