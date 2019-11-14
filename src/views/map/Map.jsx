import React, {useState, useReducer, useEffect, memo} from 'react';

import MyMap from '../../components/map/Map';
import HeaderNav from '../../components/header';
import {Container, Col, Row} from 'react-bootstrap';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import useDbs from '../../components/hooks/useDbs'
import useTracks from '../../components/hooks/useTracks'
import useUsers from '../../components/hooks/useUsers'

import PickDriver from '../../components/PickDriver'

import './Map.css';
import useInnerWidth from '../../components/hooks/useInnerWidth';
import Accordion from '../../components/Accordion/Accordion';
import {MarkerWithInfoWindow} from '../../components/map/MarkerWithInfoWindow'

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const initialState = {
  user_filtered_dbs: new Map(),
  time_filtered_dbs: new Map(),
  text_filtered_dbs: new Map(),
  time_filtered_tracks: new Map(),
  user_filtered_tracks: new Map()
}

const reducer = (state, {type, value}) => {
  switch(type){
    case 'db_init':
      return {
        ...state,
        user_filtered_dbs: value,
        text_filtered_dbs: value,
        time_filtered_dbs: value
      };
    case 'user_db_filter':
      return { ...state, user_filtered_dbs: value};
    case 'text_db_filter':
      return { ...state, text_filtered_dbs: value};
    case 'track_init':
      return {
        ...state,
        time_filtered_tracks: value,
        user_filtered_tracks: value
      };
    case 'user_track_filter':
      return { ...state, user_filtered_tracks: value};
    case 'time_filter_tracks':
      return { ...state, time_filtered_tracks: value};
    default:
      throw new Error("Dispatch not found");
  }
}

const createMap = (list, id) => {
  var map = new Map();
  list.forEach((item) => {
    map.set(item[id], item)
  })
  return map;
}

const MapView = memo(() => {

  const Drivebys = useDbs();
  const Tracks = useTracks();
  const Users = useUsers();
  const [fresh, refresh] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showDbs, setShowDbs] = useState(true);
  const [loading, setLoading] = useState(false);

  const [markers, setMarkers] = useState([])
  const [tracks, setTracks] = useState([])
  const width = useInnerWidth();

  useEffect(()=>{
    if(Tracks.length > 0){
      let initial_track_map = createMap(Tracks, "_id");
      dispatch({type: "track_init", value: initial_track_map});
    }
  },[Tracks])

  useEffect(()=>{
    if(Drivebys.length > 0){
      let initial_db_map = createMap(Drivebys, "_id");
      dispatch({type: "db_init", value: initial_db_map});
    }
  },[Drivebys])

  const filterTracks = React.useCallback((e) => {
    setLoading(true)
    let start = e[0], end = e[1]
    let filter_tracks = Tracks.filter((track)=>{
      let td = new Date(track.date)
      return td.getTime() >= new Date(start).getTime() && td.getTime() <= new Date(end).getTime()
    })
    let track_map = createMap(filter_tracks, "_id")
    dispatch({type: "time_filter_tracks", value: track_map});
  })

  useEffect(() => {
    setMarkers(Drivebys.map((home, index) => {
        return <MarkerWithInfoWindow position={{lat: home["latitude"], lng: home["longitude"]}} home={home} key={home["_id"]} />
    }))
  }, [Drivebys])

  useEffect(()=>{
    setMarkers(Drivebys.map((home) => {
      if(state.text_filtered_dbs.has(home._id) && state.user_filtered_dbs.has(home._id))
        return <MarkerWithInfoWindow position={{lat: home.latitude, lng: home.longitude}} home={home} key={home._id} />
      }).filter((item)=>!!item))
      setLoading(false)
  },[state.user_filtered_dbs, state.text_filtered_dbs])

  useEffect(()=>{
    setTracks(Tracks.map((track)=>{
      if(state.user_filtered_tracks.has(track._id) && state.time_filtered_tracks.has(track._id))
        return track;
    }).filter((item)=>!!item))
    setLoading(false)
  },[state.user_filtered_tracks, state.time_filtered_tracks])

  const selectDrivers = async (drivers) => {
    setLoading(true)
    const set_filters = async () => {
      var filtered_dbs = Drivebys.filter((db)=>(
        drivers.get(db.finder).selected
      ))
      let db_map = createMap(filtered_dbs, "_id");
      dispatch({type: "user_db_filter", value: db_map});
  
      var filtered_tracks = Tracks.filter((track)=>(
        drivers.get(track.userId).selected
      ))
      let track_map = createMap(filtered_tracks, "_id");
      dispatch({type: "user_track_filter", value: track_map});
    }
    await set_filters();
  }

  const filterList = (event) => {
    setLoading(true)
    event.preventDefault();
    var filtered_dbs = Drivebys.filter((db)=>(
      db.address.toLowerCase().search(
        event.target.value.toLowerCase()
      ) !== -1
    ))
    let db_map = createMap(filtered_dbs, "_id");
    dispatch({type: "text_db_filter", value: db_map});
  }

  const AddList = React.memo(() => {
    return (
      <>
        {
          <ul>
            {
              Drivebys.map((db)=>{
                if(state.text_filtered_dbs.has(db._id) && state.user_filtered_dbs.has(db._id))
                  return <li key={db._id}>{db.address}</li>
              })
            }
          </ul>
        }
      </>
    )
  }, [state.text_filtered_dbs, state.user_filtered_dbs])

  return (
    <div style={{overflowY:"hidden", width: "100%", height: "100%"}}>
      <HeaderNav fixed="top" color="black" />
      <Container className="w-100" style={{marginTop: "5rem", overflow:"hidden", height: "85vh"}}>
        <Row className="h-100 w-100">
          <Col xs={8} className="h-100">
            <div style={{height: "100%", width: "100%"}}>
              <div style={{visibility: loading ? "initial" : "hidden", position: "absolute", zIndex: 100, top: 0, left: 0, height: "100%", width: "100%", backgroundColor: "rgba(200,200,200,.9)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h3>Loading</h3>
              </div>
              <MyMap markers={showDbs ? markers : []} tracks={tracks}/>
            </div>
          </Col>
          <Col xs={4} className="border" style={{overflowY: "scroll", maxHeight: "100%"}}>
            <div style={{flexDirection: "row", display: "flex", justifyContent: "space-around", margin: "1rem"}}>
              <h3 style={{fontSize: 18}}>Show Drivebys?</h3>
                <input type="checkbox" checked={showDbs} onChange={()=>setShowDbs(!showDbs)}/>
              </div>
            <Accordion 
              head={<div><h3 style={{fontSize:18, textAlign: "center"}}>Select Drivers to Display</h3></div>}
              body={<PickDriver select={selectDrivers} initial={Users}/>}
              style={{margin: "4rem", marginTop: "1rem", marginBottom: 0}}
            />
            <Accordion
              head={<div><h3 style={{fontSize: 18, textAlign: "center"}}>Search for Drivebys</h3></div>}
              body={
                <>
                  <form onSubmit={e=>e.preventDefault()} style={{flexDirection: "row", display: "flex"}}>
                    <input type="text" style={{width: "70%", margin: "5px"}} className="form-control form-control-lg" placeholder="Search" onChange={filterList}/>
                  </form>
                  <AddList />
                </>
              }
              style={{margin: "4rem", marginTop: "1rem", marginBottom: "1rem"}}
            />
            <Accordion 
              head={<div><h3 style={{fontSize:18, textAlign: "center"}}>Show User Tracks</h3></div>}
              body={
                <div style={{width: "80%", height: "3rem", alignItems: "center", display: "flex", margin: "auto", flexDirection: "column"}}>
                  <Range
                    min={new Date("October 1, 2019").getTime()} 
                    max={new Date(new Date().toLocaleDateString()).getTime() + (1000*60*60*24)} 
                    defaultValue={[new Date(`${new Date().getMonth()+1}-${new Date().getDate()-1}-${new Date().getFullYear()}`).getTime(), new Date(new Date().toLocaleDateString()).getTime()]} 
                    step={1000*60*60*24} 
                    tipFormatter={value => `${new Date(value).toLocaleDateString()}`} 
                    pushable 
                    allowCross={false}
                    onAfterChange={filterTracks}
                  />
                </div>
              }
              style={{margin: "4rem", marginTop: "1rem"}}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
})

export default MapView;