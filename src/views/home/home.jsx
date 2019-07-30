import React, {useState, useEffect} from 'react';
import HeaderNav from '../../components/header';
import useScrollPosition from '../../components/hooks/useScrollPosition';

import './home.css';

export default function Home ({colors}, ...rest) {

  const scrollY = useScrollPosition();
  return ( 
    <div className="page">
      <HeaderNav fixed="top" color={scrollY > (window.innerHeight*.9) ? "black" : "light"} opacity={scrollY/window.innerHeight}/>
      <div className="container px-0 h-100" style={{backgroundColor: colors[2]}}>
        <div className="row h-100">
          <div className="col-12 px-0">
            <div className="backgroundImageContainer">
              <div className="background-image"></div>
              <div className="content darken">
                <h2 className="display-4 title">PropertySpotters</h2>
              </div>
            </div>        
          </div>
        </div>
        <div className="row" id="heading1">
          <span className="col-12">
            <h1 className="text-center">What is PropertySpotters?</h1>
            <h3 className="text-center">PropertySpotters is the new way to earn cash on the go, offering users $2000 dollars per home they find that we close a deal on!</h3>
          </span>
        </div>
        <div className="row" id="heading1">
          <span className="col-8">
            <h1 className="text-left">Sign up now and start earning money fast!</h1>
          </span>
        </div>
        
      </div>
    </div>
   )
}