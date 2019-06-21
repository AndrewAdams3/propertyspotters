import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import Map from '../../components/map/Map';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';

const MapView = () => {

  const [{Drivebys}, dbDispatch] = useStateValue();
  const [dbs, setDbs] = useState([]);

  useEffect(() => {
    setDbs(Drivebys);
  }, [])

  return dbs ? (
    <div style={{overflowY:"hidden"}}>
      <HeaderNav fixed="top" />
      <div className="container py-2" style={{marginTop: "3.65rem", maxHeight: "90vh"}}>
        <Map data={dbs}/>
      </div>
    </div>
  ) :
  (
    <div className="container"><h1>loading...</h1></div>
  )
}

export default MapView;