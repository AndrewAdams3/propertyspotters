import { useEffect } from 'react';

export default function Logout (props){
  useEffect( () => {
    localStorage.clear()
    window.location.reload();
    props.history.push('/login');
  })

  return null;
}