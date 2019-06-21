import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Axios from 'axios';

import Home from '../views/home';
import Users from '../views/users/users';
import Login from '../views/login/login';
import TableView from '../views/Table/Table';
import MapView from '../views/map/Map'; 
import { Logout } from '../components/Logout';

import { useStateValue } from '../context/State';
import { populateData } from '../helpers/data';

const MyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (<Component {...props} />)}
    />
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  console.log("props for p route", rest);
  const [{ loggedIn }, lDDispatch] = useStateValue();
  const [{ userId }, uIdDispatch] = useStateValue();
  const [{ User }, userDispatch] = useStateValue();
  const [{ Users }, usersDispatch] = useStateValue();
  const [{ Drivebys }, dbDispatch] = useStateValue();
  console.log("route id", userId);

  if(userId){
    console.log("new sesh", userId);
    localStorage.setItem('webSesh', JSON.stringify({
      lastPage: rest.path,
      userId: userId,
      timeStamp: new Date().getTime()
    }));
    return (
      <Route
        {...rest}
        render={props => (<Component {...props} />)}
      />
    )
  } else {
    console.log('attempt to restore sesh');
    try {
      let webSesh = JSON.parse(localStorage.getItem('webSesh'));
      let cDate = new Date().getTime();
      let pDate = new Date(Number(webSesh.timeStamp)).getTime();
      
      if (webSesh.lastPage && webSesh.userId && (cDate - pDate) < 5000) {
        console.log("restoring");
        Axios.get(process.env.REACT_APP_SERVER + "/data/users/byId/" + webSesh.userId)
          .then( async ({ data }) => {
              await userDispatch({
                type: 'user',
                value: data
              })
            await lDDispatch({
                type: 'login',
                value: true
              })
            await uIdDispatch({
                type: 'userId',
                value: data._id
              })
              const dts = await populateData();
            await usersDispatch({
                type: 'users',
                value: dts.u
              })
              console.log(dts.u);
            dbDispatch({
                type: 'dbs',
                value: dts.d
              })
            })
          .then((val) => {
            console.log("to last page", Component.name);
            return (
              <Route
                {...rest}
                render={props => (<Component {...props} />)}
              />
            )
          })
          .catch((err) => console.log(err))
      } else {
        console.log("to login")
        return (
          <Redirect to='/login' />
        )
      }
    } catch (err) {
      console.log(err);
    }
  }
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