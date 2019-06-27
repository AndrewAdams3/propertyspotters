import React from 'react';
import HeaderNav from '../../components/header';

import './home.css';

export default function Home ({colors}, ...rest) {
  return ( 
    <div>
      <HeaderNav color="white"/>
      <div className="container px-0 h-100" style={{backgroundColor: colors[2]}}>
        <div className="row h-100">
          <div className="col-12 px-0">
            <div className="backgroundImageContainer">
              <div className="background-image"></div>
              <div className="content darken">
                <h2 className="title">PropertySpotters</h2>
              </div>
            </div>        
          </div>
        </div>
        <div className="row" id="heading1">
          <span className="col-8">
          <h1 className="text-left">What is PropertySpotters?</h1>
            <h3 className="text-left">PropertySpotters is the new way to earn cash on the go, offering users $2000 dollars per home they find that we close a deal on!</h3>
          </span>
        </div>
        <hr style={{ backgroundColor: colors[4] }} />        
        <div className="row rounded2" id="heading2" style={{ backgroundColor: colors[1] }}>
          <span className="col-9">
            <h2 className="text-center">All you have to do is drive around town and snap pictures for a chance to earn real cash!</h2>
          </span>
        </div>
        <hr style={{backgroundColor: colors[4]}}/>
        <div className="row" id="heading1">
          <span className="col-8">
            <h1 className="text-left">Sign up now and start earning money fast!</h1>
          </span>
        </div>
      </div>
    </div>
   )
}