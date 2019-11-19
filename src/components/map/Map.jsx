/* eslint-disable no-undef */

import React, { useState, useEffect, useRef } from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from 'react-google-maps'
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

import './Map.css';
import useInnerHeight from '../hooks/useInnerHeight';
import CompleteAss from './CompleteAss';
import useUsers from '../hooks/useUsers';

function getRandomColor(){
  const colors = [
    "#0000db", "#ff2492", "#ff24ff", "#9224ff", "#2424ff", "#24ffff", "#24ff92", "#ffff24", "#ff9224", "#ff2424", "teal"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

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
  const editRef = useRef();
  const listeners = useRef([]);
  const mapRef = useRef(null);
  const [zoom,] = useState(13);
  const Users = useUsers();


  useEffect(()=>{
    const bounds = new google.maps.LatLngBounds();

    if(markers.length){
      markers.forEach(item => {
        bounds.extend(item.props.position);
      });
      mapRef.current.fitBounds(bounds);
    }

  }, [markers.length])

  useEffect(()=>{
    console.log("tacks", tracks)
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

  const TrackLine = (({track, i}) => {
    return(
      <Polyline 
      
      path={track.line} 
      //onMouseOver={(e)=>{setPolyHover({track, user: Users.find((user)=>user._id===track.user), x: e.ya.x, y: e.ya.y - 50})}}
      onClick={(e)=>{
        if(!clickedTrack){
          setPolyHover({track, user: Users.find((user)=>user._id===track.user), x: e.ya.x, y: e.ya.y - 50})
          setClickedTrack(true)
        } else if (clickedTrack){
          setPolyHover(null)
          setClickedTrack(false)
        }
      }}
      options={{
        strokeColor: getRandomColor(),
        strokeWeight: 2
      }}/>
    )
  })

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
          { !!tracks.length && 
            tracks.map((track, i)=>{
               return (
                  <TrackLine track={track} i={i} key={track.key}/>
              )           
            })
          }
          { !!polyHover &&
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
//   return equal
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