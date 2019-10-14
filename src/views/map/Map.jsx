import React, {useState, useEffect, memo} from 'react';

import MyMap from '../../components/map/Map';
import HeaderNav from '../../components/header';
import {Container, Col, Row} from 'react-bootstrap';

import useDBs from '../../components/hooks/useDbs'

import './Map.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';
import useInnerHeight from '../../components/hooks/useInnerHeight';

const MapView = memo(() => {

  const Drivebys = useDbs();
  const [dbs, setDbs] = useState([]);
  const [iaddressList, setIAddressList] = useState();
  const [addressList, setAddressList] = useState([]);
  const width = useInnerWidth();
  const height = useInnerHeight();

  useEffect(() => {
    setDbs(Drivebys);
    if(Drivebys){
      setIAddressList(Drivebys.reduce((pV, cV, cI)=>{
        pV.push({add: cV.address, lat: cV.latitude, lon: cV.longitude, id:cV._id});
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
    setAddressList(updatedList)
  }

  return dbs ? (
    <div style={{overflowY:"hidden", width: "100%", height: "100%"}}>
      <HeaderNav fixed="top" color="black" />
      <Container className="w-100" style={{marginTop: "5rem", overflow:"hidden", height: "85vh"}}>
        <Row className="h-100 w-100">
          <Col xs={8}>
            <div style={{height: width, width: "100%"}}>
              <MyMap data={dbs} filterList={addressList.length ? addressList : iaddressList}/>
            </div>
          </Col>
          <Col xs={4}>
            <form onSubmit={e=>e.preventDefault()}>
              <fieldset className="form-group">
                <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={filterList}/>
              </fieldset>
            </form>
            {addressList.length ? 
              <ul style={{overflowY: "scroll", height: height*.7}}>
                {addressList.map((item)=>{
                  return <li key={item.id}>{item.add}</li>
                })}
              </ul>
              : iaddressList &&
              <ul style={{overflowY: "scroll", height: height*.7}}>
                {iaddressList.map((item)=>{
                  return <li key={item.id}>{item.add}</li>
                })}
              </ul>
            }
          </Col>
        </Row>
      </Container>
    </div>
  ) :
  (
    <div className="container"><h1>loading...</h1></div>
  )
})

export default MapView;