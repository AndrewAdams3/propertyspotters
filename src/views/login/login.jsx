import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';

import './login.css';
import logo from '../../config/images/psLogo.png';

import { useStateValue } from '../../context/State';


const Login = () => {

  const [{ loggedIn }, logDispatch] = useStateValue();
  const [{ dbs }, dbDispatch] = useStateValue();
  const [{ users }, usersDispatch] = useStateValue();
  
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [invalid, setInvalid] = useState(false);
  var [notAdmin, setNotAdmin] = useState(false);

  const populateData = () => {
    Axios.get(process.env.REACT_APP_SERVER + "/data/users")
      .then(({data}) => {
        usersDispatch({
          type: 'users',
          value: data
        })
      })
      .catch((err) => {
        console.log(err);
      })
    Axios.get(process.env.REACT_APP_SERVER + "/data/drivebys/all")
      .then( ({data}) => {
        dbDispatch({
          type: 'dbs',
          value: data.docs
        })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  const checkCredentials = (email, pass) => {
    Axios.post(process.env.REACT_APP_SERVER + "/data/users/login", {
      email: email,
      password: pass
    }).then( ({data}) => {
      if(data.loggedIn && data.admin){
        logDispatch({
          type: 'login',
          value: {
            loggedIn: true,
            userId: data.userId
          }
        })
        populateData();
      }
      if(!data.loggedIn){
        setInvalid(true);
      }
      else if (!data.admin) {
        setNotAdmin(true);
      }
    }).catch( (err) => {
      console.log(err);
    })
  }

  const handleChange = (event, callback) => {
    callback(event.target.value);
  }

  const errMessage = () => {
    if(notAdmin){
      return (
        <label htmlFor="exampleInputEmail1" class="text-warning">Must have administrative privileges to log in</label>
      ) 
    }
    else if(invalid){
      return (
        <label htmlFor="exampleInputEmail1" class="text-danger">{"Invalid email or password"}</label>
      )
    }
    else {
      return (
        <label htmlFor="exampleInputEmail1">{"Email address"}</label>
      )
    }
  }

  return loggedIn ? <Redirect to='/home' /> :
    (
      <div className="container rounded" style={{ backgroundColor: "white", height: "100%"}}>
        <div className="row logoRow">
          <div className="col">
{/*             <h2 class="display-5 text-center mt-4">PropertySpotters</h2> */}
            <img className="img-fluid mx-auto d-block" src={logo} alt="logo"/>
          </div>
        </div>
        <div className="row h-100">
          <div className="col">
            <form className="w-50 mx-auto border rounded pb-4">
              <h2 className="display-4 text-center">Login</h2>
              <div className="form-group w-75 mx-auto">
                {errMessage()}
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(change) => handleChange(change, setEmail)}></input>
              </div>
              <div className="form-group w-75 mx-auto">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(change) => handleChange(change, setPassword)}></input>
              </div>
              <div className="form-group text-center mt-5">
                <Button className="btn-primary w-50" onClick={() => checkCredentials(email, password)}>Login</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}

export default Login;