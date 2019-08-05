import React from 'react';

import {MainRouter} from './components/MainRouter';

import { State } from './context/State';
import { Reducer } from './context/Reducer'

import './App.css';

const App = () => {
  const initialState ={}
  console.log("env", process.env.REACT_APP_SERVER);
  return(
    <State reducer={Reducer} initialState={initialState}>
      <MainRouter />
    </State>
  )
}

export default App;
