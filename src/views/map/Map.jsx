import React, {useState, useEffect, memo} from 'react';

import MyMap from '../../components/map/Map';
import HeaderNav from '../../components/header';
import {Container, Col, Row} from 'react-bootstrap';

import { useStateValue } from '../../context/State';

import './Map.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';

const MapView = memo(() => {

  const [{Drivebys},] = useStateValue();
  const [dbs, setDbs] = useState([]);
  const [iaddressList, setIAddressList] = useState();
  const [addressList, setAddressList] = useState();
  const width = useInnerWidth();
  const [center, setCenter] = useState({lat: 36.3079945, lng: -119.3231157})

  useEffect(() => {
    setDbs(Drivebys);
    if(Drivebys){
      setIAddressList(Drivebys.reduce((pV, cV, cI)=>{
        pV.push({add: cV.address, lat: cV.latitude, lon: cV.longitude});
        return pV;
      }, []))
    }
  }, [Drivebys])

  const filterList = (event) => {
    event.preventDefault();
    var updatedList = iaddressList.filter(function({add}){
      return add.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    let lat = 0, lon = 0;
    for(var i in updatedList){
      lat += updatedList[i].lat;
      lon += updatedList[i].lon;
    }
    lat /= updatedList.length
    lon /= updatedList.length
    setCenter({lat:lat, lng:lon})
    console.log(center)
    setAddressList(updatedList)
  }

  return dbs ? (
    <div style={{overflowY:"hidden", width: "100%", height: "100%"}}>
      <HeaderNav fixed="top" color="black" />
      <Container className="w-100" style={{marginTop: "5rem", overflow:"hidden", height: "85vh"}}>
        <Row className="h-100 w-100">
          <Col xs={8}>
            <div style={{height: width, width: "100%"}}>
              <MyMap data={dbs} center={center}/>
            </div>
          </Col>
          <Col xs={4} style={{overflowY: "scroll", height: "85vh"}}>
            <form onSubmit={e=>e.preventDefault()}>
              <fieldset className="form-group">
                <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={filterList}/>
              </fieldset>
            </form>
            {addressList && 
              <ul>
                {addressList.map((item)=>{
                  return <li>{item.add}</li>
                })}
              </ul>
            }
          </Col>
        </Row>
      </Container>
      {/* <div className="container main py-2">
        <form onSubmit={e=>e.preventDefault()}>
          <fieldset className="form-group">
            <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={filterList}/>
          </fieldset>
        </form>
        <MyMap data={dbs} center={center}/>
      </div> */}
    </div>
  ) :
  (
    <div className="container"><h1>loading...</h1></div>
  )
})

export default MapView;