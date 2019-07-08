import React, {useState, useEffect} from 'react';

import MyMap from '../../components/map/Map';
import HeaderNav from '../../components/header';

import { useStateValue } from '../../context/State';

import './Map.css';

const MapView = () => {

  const [{Drivebys},] = useStateValue();
  const [dbs, setDbs] = useState([]);

  useEffect(() => {
    setDbs(Drivebys);
  }, [Drivebys])

  return dbs ? (
    <div style={{overflowY:"hidden"}}>
      <HeaderNav fixed="top" color="black" />
      <div className="container main py-2">
        <MyMap data={dbs}/>
      </div>
    </div>
  ) :
  (
    <div className="container"><h1>loading...</h1></div>
  )
}

export default MapView;