import React, { useEffect } from 'react';

import {MainRouter} from './components/MainRouter';

import { State } from './context/State';
import { Reducer } from './context/Reducer'
import useSocket from './components/hooks/useSocket'
import './App.css';

const App = () => {
  const socket = useSocket(process.env.REACT_APP_SERVER);
  const initialState ={socket: socket}
  return(
    <State reducer={Reducer} initialState={initialState}>
      <MainRouter />
    </State>
  )
}

export default App;
