import React from 'react';
import HeaderNav from '../components/header';

import {useStateValue} from '../context/State';

export default function Home ({title, match}) {
  console.log(match);
  const [{Drivebys}, dbDispatch] = useStateValue("");
  return ( 
    <div>
      <HeaderNav/>
      <div className="container h-100">
        <div className="row text-center">
          <div className="col">
            <h1 className="text-black">Home Page</h1>
          </div>
        </div>
      </div>
    </div>
   )
}