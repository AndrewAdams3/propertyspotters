import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './views/home';
import Login from './views/login/login';
import TableView from './views/Table/Table';
import MapView from './views/map/Map';
import './App.css';

//Global Color Scheme:
const colors= {
  primaryBackground: "#397367",
  primaryForeground: "#63ccca",
  secondaryBackground: "#5da399",
  secondaryForeground: "#42858c",
  dark: "#35393c"
}

const loginPageStyle = { 
  backgroundColor: colors.dark, 
  height: "100vh" 
};
const pageStyle = {
  backgroundColor: colors.primaryBackground,
  height: "100%"
};

function App() {
  return (
    <Router>
      <Route exact path="/Login" 
        render={(props) => <div class="py-3" style={loginPageStyle} ><Login {...props} /> </div>}/>
      <Route exact path="/"
        render={(props) => <div class="py-3" style={loginPageStyle} ><Login {...props} /> </div>} />
      <Route exact path="/home" 
        render={(props) => <div style={loginPageStyle} ><Home {...props} colors={colors} /> </div>}/>
      <Route exact path="/table"
        render={(props) => <div style={pageStyle} ><TableView {...props} colors={colors} /> </div>} />
      <Route exact path="/map"
        render={(props) => <div style={pageStyle} ><MapView {...props}/> </div>} />
    </Router >
  );
}

export default App;
