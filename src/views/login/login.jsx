import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import {ServerAdd} from '../../config/constants';
import './login.css';
import logo from '../../config/images/psLogo.png';

const Login = ({colors}) => {

  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [loggedIn, setLoggedIn] = useState(false);
  var [invalid, setInvalid] = useState(false);
  var [notAdmin, setNotAdmin] = useState(false);

  const checkCredentials = (email, pass) => {
    Axios.post(ServerAdd + "/data/users/login", {
      email: email,
      password: pass
    }).then( ({data}) => {
      if(data.loggedIn && data.admin){
        setLoggedIn(true);
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
        <label for="exampleInputEmail1" class="text-warning">Must have administrative privileges to log in</label>
      ) 
    }
    else if(invalid){
      return (
        <label for="exampleInputEmail1" class="text-danger">{"Invalid email or password"}</label>
      )
    }
    else {
      return (
        <label for="exampleInputEmail1">{"Email address"}</label>
      )
    }
  }

  return loggedIn ? <Redirect to='/home' /> :
    (
      <div class="container rounded" style={{ backgroundColor: "white", height: "100%"}}>
        <div class="row logoRow">
          <div class="col">
{/*             <h2 class="display-5 text-center mt-4">PropertySpotters</h2> */}
            <img class="img-fluid mx-auto d-block" src={logo} alt="logo"/>
          </div>
        </div>
        <div class="row h-100">
          <div class="col">
            <form class="w-50 mx-auto border rounded pb-4">
            <h2 class="display-4 text-center">Login</h2>
              <div class="form-group w-75 mx-auto">
                {errMessage()}
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(change) => handleChange(change, setEmail)}></input>
              </div>
              <div class="form-group w-75 mx-auto">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(change) => handleChange(change, setPassword)}></input>
              </div>
              <div class="form-group text-center mt-5">
                <Button class="btn-primary w-50" onClick={() => checkCredentials(email, password)}>Login</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}

export default Login;