/* eslint-disable no-undef */

import React, { useState, useEffect, useRef } from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, InfoWindow } from 'react-google-maps'
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

import './Map.css';
import useInnerHeight from '../hooks/useInnerHeight';
import CompleteAss from './CompleteAss';
import Axios from 'axios';
import useUsers from '../hooks/useUsers';

const MyMap = (compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%`, width: `100%` }} />,
    mapElement: <div style={{ height: `85vh`, width: '100%' }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      if(markerClusterer.markerClusterer_.map.zoom >= 18){
        return {max: true, markers: clickedMarkers.map((mark, i)=>JSON.parse(mark.title))}
      } else return {max: false, markers: []}
    },
    onHover: () => (e) =>{
      return JSON.parse(e.markers_[e.markers_.length-1].title)
    }
  }),
  withScriptjs,
  withGoogleMap,
)(({markers, tracks, onMarkerClustererClick}) =>{
  const [res, setRes] = useState([]);
  const drawRef = useRef();
  const [drawMode, setDrawMode] = useState("");
  const [poly, setPoly] = useState()
  const [completeAss, setCompleteAss] = useState(false)
  const [polyHover, setPolyHover] = useState();
  const [clickedTrack, setClickedTrack] = useState(false)
  const lineRefs = useRef();
  const editRef = useRef();
  const listeners = useRef([]);
  const mapRef = useRef(null);
  const [zoom,] = useState(13);
  const Users = useUsers();

  const [snappedPolylines, setSnappedPolylines] = useState([])

  useEffect(()=>{
    const bounds = new google.maps.LatLngBounds();

    if(markers.length){
      markers.forEach(item => {
        bounds.extend(item.props.position);
      });
      mapRef.current.fitBounds(bounds);
    }

  }, [markers])

  useEffect(()=>{
    const getLines = async () => {
      lineRefs.current = []
      tracks.forEach(async (track)=>{
        lineRefs.current.push(React.createRef())
        const line = await runSnapToRoad(track)
        setSnappedPolylines((prev)=>[...prev, {line: line, date: track.date, user: track.userId}])
      })
    }
    if(tracks.length > 0){
      setSnappedPolylines([])
      getLines()
    } else {
      setSnappedPolylines([])
    }
  },[tracks])

  const clearPoly = () => {
    if(poly){
      google.maps.event.clearInstanceListeners(poly);
      poly.setMap(null);
      setPoly()
    }
  }

  const assignPolygon = () => {
    if(poly){
      var bounds = new google.maps.LatLngBounds();
      const coords = poly.getPath().g.map((coord)=>{return {lat:coord.lat(), lng:coord.lng()}})
      for (let i = 0; i < coords.length; i++) {
        bounds.extend(coords[i]);
      }
      setCompleteAss(true)
    }
  }

  useEffect(()=>{
    if(poly){
      listeners.current.push(google.maps.event.addListener(editRef.current.getPath(), 'insert_at', function () {
        setPoly(editRef.current);
      }));
      listeners.current.push(google.maps.event.addListener(editRef.current.getPath(), 'remove_at', function () {
        setPoly(editRef.current);
      }));      
      listeners.current.push(google.maps.event.addListener(editRef.current.getPath(), 'set_at', function () {
        setPoly(editRef.current);
      }));
    } else if(listeners.current){
      return listeners.current.forEach((listener)=>listener.remove())
    }
  }, [poly])

  const completePoly = (newPoly) => {
    if(poly) clearPoly();
    editRef.current = newPoly;
    setPoly(newPoly);
    setDrawMode("");
    var path = newPoly.getPath()
    runSnapToRoad(path)
  }

  // Snap a user-created polyline to roads and draw the snapped path
  const runSnapToRoad = async ({path}) => {
    var chunks = [], i = 0
    while (i < path.length) {
      chunks.push(path.slice(i, i += 100));
    }
    var pathChunk = []
    chunks.forEach((chunk)=>{
      pathChunk.push(chunk.map((point)=>
        `${point.latitude},${point.longitude}`
      ))
    })

    const getPaths = async () => {
      let res = pathChunk.map(async (path)=>{
        let {data} = await Axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=${path.join('|')}&interpolate=${true}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
        return data;
      })
      return await Promise.all(res)
    }
    let paths = await getPaths()
    return processSnapToRoadResponse(paths);
  }

  const processSnapToRoadResponse = (res) => {
    var sp = []
    for(var j = 0; j < res.length; j++){
      for (var i = 0; i < res[j].snappedPoints.length; i++) {
        var latlng = new google.maps.LatLng(
          res[j].snappedPoints[i].location.latitude,
          res[j].snappedPoints[i].location.longitude
        );
        sp.push(latlng);
      }
    }
    return sp
  }

  useEffect(()=>{
    console.log("p", polyHover)
  },[polyHover])
  return(
    <>
    <GoogleMap
      zoom={zoom}
      defaultCenter={new google.maps.LatLng(39, -119)}
      options={{maxZoom: 18}}
      ref={mapRef}
      streetViewControl= {true}
      zoomControl={true}
      >
      <MarkerClusterer
        onClick={(e)=>{setRes(res.max ? false : onMarkerClustererClick(e))}}
        averageCenter
        enableRetinaIcons
        gridSize={60}
        minimumClusterSize={3}
      >
        <DrawingManager
          ref={drawRef}
          drawingMode={drawMode}
          key={"drawer"}
          defaultOptions={{
            drawingControl: false,
            drawingControlOptions: {
              drawingModes: [],
            },
            polygonOptions: {
              fillColor: `#ffff00`,
              fillOpacity: .2,
              strokeWeight: 2,
              clickable: true,
              zIndex: 1,
              draggable: true,
              editable: true
            },
          }}
          //onPolygonComplete={completePoly}
          />  
          {
            markers
          }
          {res.max &&
            <ClusterInfo homes={res.markers} close={()=>{setRes([])}}/>
          }   
          { !!snappedPolylines.length && 
            snappedPolylines.map((track, i)=>{
               return (
                <Polyline 
                  path={track.line} 
                  ref={lineRefs.current[i]}
                  onMouseOver={(e)=>{setPolyHover({track, user: Users.find((user)=>user._id===track.user), x: e.ya.x, y: e.ya.y - 50})}}
                  onMouseOut={()=>!clickedTrack && setPolyHover()}
                  onClick={(e)=>{
                    if(!clickedTrack && polyHover){
                      setClickedTrack(true)
                      setPolyHover({track, user: Users.find((user)=>user._id===track.user), x: e.ya.x, y: e.ya.y - 50})
                    } else if (clickedTrack && polyHover){
                      setPolyHover()
                      setClickedTrack(false)
                    }
                  }}
                  options={{
                    strokeColor: "red",
                    strokeWeight: 2
                  }}/>         
              )           
            })
          }
          { polyHover &&
            <div className="track-window" style={{top: polyHover.y, left: polyHover.x}}>
              <h3 style={{textTransform: "capitalize"}}>{polyHover.user.fName} {polyHover.user.lName}</h3>
              <h3>{new Date(polyHover.track.date).toLocaleDateString()}</h3>
            </div>
          }

          <div style={{position: "absolute", top: ".9rem", zIndex: 5, left: "50%", width: "20rem", marginLeft: "-50px", display: "flex", justifyContent: "space-around"}}>
            <button className="col-3" onClick={()=>{setDrawMode((prev)=>prev === "polygon" ? "" : "polygon")}} style={{display: "inline-flex"}}>
              <span>{drawMode === "polygon" ? "Point" :  "Draw"}</span>
            </button>
            <button className="col-3" onClick={clearPoly} style={{display: "inline-flex"}}>
              <span>Clear</span>
            </button>
            <button className="col-3" onClick={assignPolygon} style={{display: "inline-flex", visibility: poly === undefined ? "hidden" : "inherit"}}>
              <span>Assign?</span>
            </button>
          </div> 

      </MarkerClusterer>
      {
        completeAss && poly &&
        <CompleteAss close={()=>{setCompleteAss(false)}} clear={()=>clearPoly()} coords={poly.getPath().g.map((coord)=>{return {lat:coord.lat(), lng:coord.lng()}})}/>
      }
    </GoogleMap> 
    </>
  )
}));

// , (prev, next)=> {
//   var equal = true
//   Object.keys(prev).map((key)=>{
//     if(key !== "_markers"){
//       if(prev[key] != next[key]) equal = false
//     }
//   })
//   return prev.refresh === next.refresh
// }


const ClusterInfo = ({homes, close}) => {
  const h = useInnerHeight();
  return(
    <>
    <div className="closer" onClick={close}>X</div>
    <div className="clusterInfo" style={{height: h-100}}>
      {
        homes.reverse().map((home)=>{
          return(
            <>
            <h4 style={{color: "white"}}>{home.address}</h4>
            <h4 style={{marginBottom: "2rem", color: "white"}}>Found: {new Date(home.date).toLocaleDateString()}</h4>
            <h5 style={{whiteSpace: "nowrap", height: "2rem"}} className="border-bottom"><a href={home.picturePath}>{home.picturePath}</a></h5>
            </>
          )
        })
      }
    </div>
    </>
  )
}

export default MyMap;