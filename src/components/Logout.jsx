import React, { useEffect, useState } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';

export const Logout = () => {

  const [success, setSuccess] = useState(false);

  useEffect( () => {
    console.log("test");
    localStorage.clear();
    setSuccess(true);
  }, [])

  return success ? (
    <Redirect to="/home"/>
  )
  :
  (
    <div>
        <h1>loading...</h1>
    </div>
  )
}