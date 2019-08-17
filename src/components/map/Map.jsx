/* eslint-disable no-undef */

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

import './Map.css';
const MyMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%`, width: '100&' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      if(markerClusterer.markerClusterer_.map.zoom >= 18){
        return {max: true, markers: clickedMarkers}
      } else return {max: false, markers: []}
    },
  }),
  withScriptjs,
  withGoogleMap,
)(({data, onMarkerClustererClick}) =>{
  const [res, setRes] = useState([]);
  const [clickData, setClickData] = useState([])
  let markers = data.map((home, index) => {
    if (home["latitude"] !== 0) {
      return <MarkerWithInfoWindow position={new google.maps.LatLng(home["latitude"], home["longitude"])} home={home} key={home["_id"]} />
    }
    return null;
  })
  return(
    <>
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{lat: 36.3079945, lng: -119.3231157}}
      options={{maxZoom: 18}}>
      <MarkerClusterer
        onClick={(e)=>setRes(res.max ? false : onMarkerClustererClick(e))}
        averageCenter
        enableRetinaIcons
        gridSize={60}
        minimumClusterSize={3}
      >
        {
          markers
        }
          {res.max &&
            <ClusterInfo homes={markers.filter((marker)=>{
              let found = false
              console.log("pos: ", marker.getPosition())
              console.log("res", res.markers[0].position.lat, "mark", marker.props.position.lat)
              for(let i = 0; i < res.markers.length; i++){
                if (res.markers[i].position.lat === marker.props.position.lat && res.markers[i].position.lon === marker.props.position.lon){
                  found = true;
                  break;
                }
              }
              return found;
            })}/>
          }
      </MarkerClusterer>
    </GoogleMap> 
    </>
  )
});

const ClusterInfo = ({homes}) => {
  console.log("homes: ", homes);
  return(
    <div className="clusterInfo">
      {
        homes.map((home)=>{
          return(
            <h3>{new Date(home.date).toLocaleDateString()}</h3>
          )
        })
      }
    </div>
  )
}

const MarkerWithInfoWindow = ({position, home, id}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [rotation, setRotation] = useState(90);
  const [horizontal, setHorizontal] = useState(false)
  const imgRef = useRef(null);
  const [date,] = useState(new Date(home["date"]));
  
  useEffect(()=>{
    let bounds = imgRef.current ? ReactDOM
      .findDOMNode(imgRef.current)
      .getBoundingClientRect() : null
    if(bounds){
      if(bounds.bottom - bounds.top > bounds.right - bounds.left){
        setHorizontal(false)
      } else setHorizontal(true);
    }
    console.log("size", bounds);
  }, [rotation])

  const onToggleOpen = () => { setIsOpen(!isOpen);}
  const onMouseover = () => { if (!isOpen) setIsHover(false);}
  const onMouseOut = () => { if (!isOpen) setIsHover(false)}
  return (
    <Marker
      key={id}
      position={position}
      onClick={onToggleOpen}
      onMouseOver={onMouseover}
      onMouseOut={onMouseOut}>

      {(isOpen || isHover) &&
        <InfoWindow onCloseClick={onToggleOpen} style={{width: 500, height: 500}}>
          <div className="windowContainer" style={{height: horizontal ? 300 : 500}}>
            <div className="rotateContainer">
              <img className="rotate border border-dark rounded" src="../../rotate.png" onClick={()=>{setRotation(rotation + 90)}}/>
            </div>
            <div className="info">
              <p style={{ textAlign: "center" }}>{home["address"]}</p>
              <p style={{ textAlign: "center" }}>{"Found " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</p>
            </div>
            <hr style={{ backgroundColor: "black" }} />
            <div className="imageContainer" style={{justifyContent:"center", marginTop: horizontal ? 0 : "8rem"}}>
              <img ref={imgRef} style={{ transform: `rotate(${rotation}deg)`, borderStyle: "solid", borderColor: "black", borderWidth: ".1rem" }} src={home["picturePath"]} alt="pic" />
            </div>
          </div>
        </InfoWindow>}
    </Marker>
  )
}

export default MyMap;