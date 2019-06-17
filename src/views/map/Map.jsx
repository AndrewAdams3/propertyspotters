import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import Map from '../../components/map/Map';
import {ServerAdd} from '../../config/constants';

const MapView = () => {

  const [dbs, setDbs] = useState([]);

  useEffect(() => {
    Axios.get(ServerAdd + "/data/drivebys/all")
      .then(({ data }) => {
        if (data.response === 0) {
          setDbs(data.docs)
          console.log("total length: ", dbs.length);
        }
        else {
          console.log("err");
        }
      })
  }, [])

  return dbs ? (
    <div>
      <Map data={dbs}/>
    </div>
  ) :
  (
    <div class="container"><h1>loading...</h1></div>
  )
}

export default MapView;