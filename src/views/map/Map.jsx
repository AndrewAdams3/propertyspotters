import React, {useState, useReducer, useEffect, memo, useRef} from 'react';

import MyMap from '../../components/map/MyMap';
import {GoogleMapProvider} from '@googlemap-react/core'
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
import Accordion from '../../components/Accordion/Accordion';
import MarkerWithInfoWindow from '../../components/map/MarkerWithInfoWindow'

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const initialState = {
  user_filtered_dbs: new Map(),
  time_filtered_dbs: new Map(),
  text_filtered_dbs: new Map(),
  time_filtered_tracks: new Map(),
  user_filtered_tracks: new Map()
}

function getRandomColor(){
  const colors = [
    "#0000db", "#ff2492", "#ff24ff", "#9224ff", "#2424ff", "#24ffff", "#24ff92", "#ffff24", "#ff9224", "#ff2424", "teal"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
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
    case 'user_filter':
      return { ...state, user_filtered_dbs: value.db, user_filtered_tracks: value.tracks};
    case 'text_db_filter':
      return { ...state, text_filtered_dbs: value};
    case 'track_init':
      return {
        ...state,
        time_filtered_tracks: value,
        user_filtered_tracks: value
      };
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const [showDbs, setShowDbs] = useState(true);
  const [hasGoogle, setHasGoogle] = useState(false);

  const [markers, setMarkers] = useState([])
  const [tracks, setTracks] = useState([])
  const [showTracks, setShowTracks] = useState(true)

  const [snappedPolylines, setSnappedPolylines] = useState([])

  useEffect(()=>{
    const script = document.createElement("script");
    script.src=`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    window.document.body.appendChild(script);
    script.addEventListener('load', () => {
      setHasGoogle(true);
    })
  },[])
  
  useEffect(()=>{
    if(Tracks.length > 0){
      let initial_track_map = createMap(Tracks, "_id");
      dispatch({type: "track_init", value: initial_track_map});
    }
  },[Tracks])

  useEffect(()=>{
    setSnappedPolylines(tracks.map((track)=>track.snappedLine ? {date: track.date, id: track._id, user: track.userId, line: track.snappedLine, path: track.path, color: getRandomColor()} : null).filter((track)=>!!track))
  },[tracks.length])

  useEffect(()=>{
    if(Drivebys.length > 0){
      let initial_db_map = createMap(Drivebys, "_id");
      dispatch({type: "db_init", value: initial_db_map});
    }
  },[Drivebys])

  const filterTracks = React.useCallback((e) => {
    let start = e[0], end = e[1]
    let filter_tracks = Tracks.filter((track)=>{
      let td = new Date(track.date)
      console.log("max: ", new Date(new Date().toLocaleDateString()).getTime() + (1000*60*60*24))
      console.log("test date", td);
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
    },[state.user_filtered_dbs, state.text_filtered_dbs])

  useEffect(()=>{
    setTracks(Tracks.map((track)=>{
      if(state.user_filtered_tracks.has(track._id) && state.time_filtered_tracks.has(track._id))
        return track;
    }).filter((item)=>!!item))
  },[state.user_filtered_tracks, state.time_filtered_tracks])

  const selectDrivers = ((drivers) => {
    const set_filters = () => {
      var filtered_dbs = Drivebys.filter((db)=>(
        drivers.get(db.finder).selected
      ))
      let db_map = createMap(filtered_dbs, "_id");
  
      var filtered_tracks = Tracks.filter((track)=>(
        drivers.get(track.userId).selected
      ))
      let track_map = createMap(filtered_tracks, "_id");
      dispatch({type: "user_filter", value: {db: db_map, tracks: track_map}});
    }
    set_filters();
  })

  const filterList = (event) => {
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
              <GoogleMapProvider key="google-provider">
                {React.useMemo(()=> hasGoogle && <MyMap markers={showDbs ? markers : []} tracks={showTracks ? snappedPolylines : []}/>, [markers.length, snappedPolylines.length, showDbs, showTracks])}
              </GoogleMapProvider>
            </div>
          </Col>
          <Col xs={4} className="border" style={{overflowY: "scroll", maxHeight: "100%"}}>
            <div style={{flexDirection: "row", display: "flex", justifyContent: "space-around", margin: "1rem"}}>
                <h3 style={{fontSize: 18}}>Show Drivebys?</h3>
                <input type="checkbox" checked={showDbs} onChange={()=>setShowDbs(!showDbs)}/>
              </div>
              <div style={{flexDirection: "row", display: "flex", justifyContent: "space-around", margin: "1rem"}}>
                <h3 style={{fontSize: 18}}>Show Tracks?</h3>
                <input type="checkbox" checked={showTracks} onChange={()=>setShowTracks(!showTracks)}/>
              </div>
            <Accordion 
              head={<div><h3 style={{fontSize:18, textAlign: "center"}}>Select Drivers to Display</h3></div>}
              body={React.useMemo(()=><PickDriver select={selectDrivers} initial={Users}/>, [Users, selectDrivers])}
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
                    min={new Date(new Date().toLocaleDateString()).getTime() - (1000*60*60*24 * 50) + 1} 
                    max={new Date(new Date().toLocaleDateString()).getTime() + 1} 
                    defaultValue={[new Date(new Date().toLocaleDateString()).getTime() - (1000*60*60*24 * 50) + 1, new Date(new Date().toLocaleDateString()).getTime()]} 
                    step={(1000*60*60*24)} 
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