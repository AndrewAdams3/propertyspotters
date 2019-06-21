import React, { useEffect }from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Axios from 'axios';

import Home from '../views/home';
import Users from '../views/users/users';
import Login from '../views/login/login';
import TableView from '../views/Table/Table';
import MapView from '../views/map/Map'; 
import { Logout } from '../components/Logout';

import { useStateValue } from '../context/State';

const MyRoute = ({ component: Component, ...rest }) => {

  const [{ loggedIn }, lDDispatch] = useStateValue();
  const [{ userId }, uIdDispatch] = useStateValue();
  const [{ User }, userDispatch] = useStateValue();


  let webSesh = JSON.parse(localStorage.getItem('webSesh'));
  let cDate = new Date().getTime();
  let pDate = new Date(Number(webSesh.timeStamp)).getTime();
  console.log("sesh: ", webSesh);
  if (webSesh.lastPage && webSesh.userId && (cDate - pDate) < 5000) {
    console.log("restoring sesh");
    Axios.get(process.env.REACT_APP_SERVER + "/data/users/byId/" + webSesh.userId)
      .then( ({data}) => {
        if(data){
          console.log(data);
          userDispatch({
            type: 'user',
            value: data
          })
          lDDispatch({
            type: 'login',
            value: true
          })
          uIdDispatch({
            type: 'userId',
            value: data._id
          })
          return <Redirect to={webSesh.lastPage} />
        }
      })
      .catch( (err) => console.log(err))
  }

  return (
    <Route
      {...rest}
      render={props => (<Component {...props} />)}
    />
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  
  const [{ loggedIn }, dispatch] = useStateValue();
  const [{ userId }, uIdDispatch] = useStateValue();
  
  console.log("userid rest", userId);
  localStorage.setItem('webSesh', JSON.stringify({
    lastPage: rest.path,
    userId: userId,
    timeStamp: new Date().getTime()
  }));


  return (
    <Route
      {...rest}
      render={props => (
        loggedIn ?
            <Component {...props}/>
           :
            <Redirect to='/login' />
      )}
    />
  )
}

export const MainRouter = (props) => {
  return (
    <Router>
      <Switch>
        <MyRoute exact path="/" component={Login} />
        <MyRoute exact path="/login" component={Login} />
        <ProtectedRoute exact path="/home" component={Home}/>
        <ProtectedRoute exact path="/users" component={Users}/>
        <ProtectedRoute exact path="/table" component={TableView}/>
        <ProtectedRoute exact path="/map" component={MapView}/>
        <ProtectedRoute exact path="/logout" component={Logout}/>
      </Switch>
    </Router>
  );
}