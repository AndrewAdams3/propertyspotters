import React, { useEffect, useState } from 'react';

export default function Logout (props){
  useEffect( () => {
    console.log("clear loc");
    props.history.push('/login');
    localStorage.clear()
    window.location.reload();
    return(()=>{localStorage.clear()})
  }, [])

  return null;
}