import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

import './signup.css';
import logo from '../../config/images/psLogo.png';

import { useStateValue } from '../../context/State';
import { populateData } from '../../helpers/data';

const Signup = (props) => {

  const [, logDispatch] = useStateValue();
  const [, dbDispatch] = useStateValue();
  const [, usersDispatch] = useStateValue();
  const [, idDispatch] = useStateValue();

  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [already, setAlready] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [notVerified, setNotVerified] = useState(false);


  const handleChange = (event, callback) => {
    callback(event.target.value);
  }

  const checkCredentials = (email, pass) => {
    Axios.post(process.env.REACT_APP_SERVER + "/data/users/login", {
      email: email,
      password: pass
    }).then(async ({ data }) => {
      if (data.admin && data.verified) {
        logDispatch({
          type: 'login',
          value: true
        })
        idDispatch({
          type: 'userId',
          value: data.userId
        })
        const dts = await populateData();
        usersDispatch({
          type: 'users',
          value: dts.u
        })
        dbDispatch({
          type: 'dbs',
          value: dts.d
        })
        setToHome(true)
      } else{
        setNotVerified(true);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const try_signup = (e, p) => {
    Axios.post(`${process.env.REACT_APP_SERVER}/data/users/signup`, {
      email: e,
      password: p,
      admin: true
    })
    .then(({data})=>{
      console.log("data", data);
      if(data.created === false){
        setAlready(true);
      } else{
        console.log("logging in");
        checkCredentials(e, p)
      }
    })
    .catch((err)=>console.error(err))
  }

  const errMessage = () => {
    if (already) {
      return (
        <label htmlFor="exampleInputEmail1" class="text-warning">User Already Exists</label>
      )
    } else if(notVerified){
      return(
        <label htmlFor="exampleInputEmail1" class="text-info">Please log in once your account has been verified</label>
      )
    }
    else {
      return (
        <label htmlFor="exampleInputEmail1">{"Email address"}</label>
      )
    }
  }

  return toHome ? <Redirect to="/admin-home" /> : (
    <div className="container rounded" style={{ backgroundColor: "white", height: "100%" }} onKeyPress={(event) => {if (event.key === "Enter" && email.length && password.length) try_signup(email, password)}}>
      <div className="row logoRow">
        <a className="col" href="#" onClick={()=>setToHome(true)}>
          <img className="img-fluid mx-auto d-block" src={logo} alt="logo" style={{ cursor: "pointer" }} />
        </a>
      </div>
      <div className="row h-100">
        <form className="col col-lg-8 mx-auto border rounded pb-4">
          <h2 className="display-4 text-center">Sign Up</h2>
          <div className="form-group w-75 mx-auto">
            {errMessage()}
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(change) => handleChange(change, setEmail)}></input>
          </div>
          <div className="form-group w-75 mx-auto">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(change) => handleChange(change, setPassword)}></input>
          </div>
          <div className="form-group text-center mt-5">
            <Button className="btn-primary w-50" onClick={() => try_signup(email, password)}>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup;