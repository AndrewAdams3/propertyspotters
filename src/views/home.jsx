import React, {useState} from 'react';
import HeaderNav from '../components/header';

export default function Home ({title}) {
  var [count, setCount] = useState(0);
  return( 
    <div>
      <HeaderNav />
      <div class="container h-100">
        <div class="row text-center">
          <div class="col">
            <h1 class="text-white">Home Page</h1>
          </div>
        </div>
      </div>
    </div>
   )
}