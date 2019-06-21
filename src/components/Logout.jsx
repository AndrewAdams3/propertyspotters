import React, { useEffect } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';

import { useStateValue } from '../context/State';


export const Logout = () => {
  const [{ loggedIn }, dispatch] = useStateValue();

  useEffect( () => {
/*     dispatch({
      type:'login',
      value: false
    }) */
  })

  return loggedIn ? (
    <div>
      <h1>loggin out</h1>
    </div>
  ) : (
    <Redirect to="/login" />
  )
}