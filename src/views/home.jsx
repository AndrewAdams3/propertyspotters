import React, {useState} from 'react';
import HeaderNav from '../components/header';
import { BrowserRouter as Redirect } from "react-router-dom";

export default function Home ({title}) {

  const [path, setPath] = useState("");

  return path ? <Redirect to={path}/> : ( 
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