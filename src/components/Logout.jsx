import React, { useEffect, useState } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Logout (props){

  useEffect( () => {
    localStorage.clear()
    props.history.push('/login');
  }, [])

  return null;
}