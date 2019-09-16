/* eslint-disable no-undef */

import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import './Map.css';
import useInnerHeight from '../hooks/useInnerHeight';

const MyMap = compose(
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
)(({data, onMarkerClustererClick, onHover, filterList}) =>{
  const [res, setRes] = useState([]);
  const mapRef = useRef();
  const [zoom, setZoom] = useState(13);
  
  useEffect(()=>{
    const bounds = new google.maps.LatLngBounds();
    filterList.map(item => {
        bounds.extend({lat: item.lat, lng:item.lon});
    });
    mapRef.current.fitBounds(bounds);
  },[filterList])

  let markers = data.map((home, index) => {
    if (home["latitude"] !== 0) {
      return <MarkerWithInfoWindow position={new google.maps.LatLng(home["latitude"], home["longitude"])} home={home} key={home["_id"]} />
    }
    return null;
  })

  return(
    <>
    <GoogleMap
      zoom={zoom}
      defaultCenter={new google.maps.LatLng(39, -119)}
      options={{maxZoom: 18}}
      ref={mapRef}
      streetViewControl= {true}
      zoomControl={true}>
      <MarkerClusterer
        onClick={(e)=>{setRes(res.max ? false : onMarkerClustererClick(e)); console.log(mapRef.current)}}
        averageCenter
        enableRetinaIcons
        gridSize={60}
        minimumClusterSize={3}
        // onMouseOver={(e)=>{if(!latest) setLatest(onHover(e))}}
        // onMouseOut={()=>setLatest(null)}        
      >
        {
          markers
        }
        {res.max &&
          <ClusterInfo homes={res.markers} close={()=>{setRes([])}}/>
        }
      </MarkerClusterer>
    </GoogleMap> 
    </>
  )
});



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

const MarkerWithInfoWindow = ({position, home, id}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
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
  }, [rotation])

  const onToggleOpen = () => { setIsOpen(!isOpen);}
  return (
    <Marker
      key={id}
      position={position}
      onClick={onToggleOpen}
      title={JSON.stringify(home)}>

      {(isOpen) &&
        <InfoWindow onCloseClick={onToggleOpen}>
          <div className="windowContainer" >
            <div className="rotateContainer">
              <img className="rotate border border-dark rounded" src="../../rotate.png" onClick={()=>{setRotation(rotation + 90)}}/>
            </div>
            <div className="info">
              <p style={{ textAlign: "center" }}>{home["address"]}</p>
              <p style={{ textAlign: "center" }}>{"Found " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</p>
            </div>
            <hr style={{ backgroundColor: "black", marginBottom: "2rem" }} />
            <div style={{height: "200px", width: "90%"}}>
              <div className="imageContainer" style={{transform: `rotate(${rotation}deg)`, justifyContent:"flex-start" }}>
                <img ref={imgRef} style={{ borderStyle: "solid", borderColor: "black", borderWidth: ".1rem", height: "100%", width: "100%"}} src={home["picturePath"]} alt="pic" />
              </div>
            </div>
            <p className="mt-5">Image Link: <br/><a href={home["picturePath"]} target="_blank" rel="noopener noreferrer">{home["address"]}</a></p>
          </div>
        </InfoWindow>}
    </Marker>
  )
}

export default MyMap;