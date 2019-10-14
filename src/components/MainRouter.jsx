import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Axios from 'axios';

import Home from '../views/home/home';
import Users from '../views/users/users';
import Login from '../views/login/login';
import Signup from '../views/signup/signup';
import TableView from '../views/Table/Table2';
import ChartView from '../views/chart/ChartView';
import MapView from '../views/map/Map'; 
import Logout from '../components/Logout';

import colors from '../config/colors';

import { useStateValue } from '../context/State';

const MyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (<Component {...props} colors={colors}/>)}
    />
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => {

  const [, lDDispatch] = useStateValue();
  const [{ userId }, uIdDispatch] = useStateValue();
  const [, userDispatch] = useStateValue();

  if(userId){
    localStorage.setItem('webSesh', JSON.stringify({
      lastPage: rest.path,
      userId: userId,
      timeStamp: new Date().getTime()
    }));
    return (
      <Route
        {...rest}
        render={props => (<Component {...props} colors={colors}/>)}
      />
    )
  } else {
    try {
      let webSesh = JSON.parse(localStorage.getItem('webSesh'));
      if(!webSesh) return <Redirect to="/home"/>
      let cDate = new Date().getTime();
      let pDate = new Date(Number(webSesh.timeStamp)).getTime();
      
      if (webSesh.lastPage && webSesh.userId && (cDate - pDate) < (24 * 60 * 60 * 1000)) {
        Axios.get(process.env.REACT_APP_SERVER + "/data/users/byId/" + webSesh.userId)
          .then( async ({ data }) => {
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
            return (
              <Route
                {...rest}
                render={props => (<Component {...props} colors={colors}/>)}
              />
            )
            })
          .catch((err) => console.log(err))
      } else {
        return (
          <Redirect to='/login' />
        )
      }
    } catch (err) {
      console.log(err);
    }
  }
  return null
}

export const MainRouter = (props) => {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" component={Home}/>
        <MyRoute exact path="/home" component={Home}/>
        <MyRoute exact path="/login" component={Login}/>
        <MyRoute exact path="/signup" component={Signup} />
        <ProtectedRoute exact path="/admin-home" component={Home} />
        <ProtectedRoute exact path="/users" component={Users}/>
        <ProtectedRoute exact path="/table" component={TableView}/>
        <ProtectedRoute exact path="/chart" component={ChartView}/>
        <ProtectedRoute exact path="/map" component={MapView}/>
        <ProtectedRoute exact path="/logout" component={Logout}/>
      </Switch>
    </Router>
  );
}