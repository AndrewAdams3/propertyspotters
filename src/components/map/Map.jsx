/* eslint-disable no-undef */

import React, { useState, useEffect, useRef } from 'react'
import { compose, withProps, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow,  } from 'react-google-maps'
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

import './Map.css';
import useInnerHeight from '../hooks/useInnerHeight';
import CompleteAss from './CompleteAss';
import Axios from 'axios';

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
)(({data, onMarkerClustererClick, filterList}) =>{
  const [res, setRes] = useState([]);
  const drawRef = useRef();
  const [drawMode, setDrawMode] = useState("");
  const [poly, setPoly] = useState()
  const [completeAss, setCompleteAss] = useState(false)
  const editRef = useRef();
  const listeners = useRef([]);
  const mapRef = useRef();
  const [zoom,] = useState(13);

  const [pathValues, setPathValues] = useState([])
  const [snappedCoordinates, setSnappedCoordinates] = useState([])
  const [placeIdArray, setPlaceIdArray] = useState([])
  const [snappedPolylines, setSnappedPolylines] = useState([])
  
  useEffect(()=>{
    const bounds = new google.maps.LatLngBounds();
    filterList.forEach(item => {
        bounds.extend({lat: item.lat, lng:item.lon});
    });
    mapRef.current.fitBounds(bounds);
  },[filterList])

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

  let markers = data.map((home, index) => {
    if (home["latitude"] !== 0) {
      return <MarkerWithInfoWindow position={new google.maps.LatLng(home["latitude"], home["longitude"])} home={home} key={home["_id"]} />
    }
    return null;
  })

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
  const runSnapToRoad = async (path) => {
    setPathValues([])
    let pv = []
    for (var i = 0; i < path.getLength(); i++) {
      pv.push(path.getAt(i).toUrlValue());
    }

    setPathValues(pv)

    let { data } = await Axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=${pv.join('|')}&interpolate=${true}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
    
    processSnapToRoadResponse(data);
    drawSnappedPolyline();
    getAndDrawSpeedLimits();
  }

  function processSnapToRoadResponse(data) {
    setSnappedCoordinates([])
    setPlaceIdArray([])
    var sp = []
    var pa = []
    for (var i = 0; i < data.snappedPoints.length; i++) {
      var latlng = new google.maps.LatLng(
          data.snappedPoints[i].location.latitude,
          data.snappedPoints[i].location.longitude);
      sp.push(latlng);
      pa.push(data.snappedPoints[i].placeId);
    }
    setSnappedCoordinates(sp)
    setPlaceIdArray(pa)
  }

  function drawSnappedPolyline() {
    var snappedPolyline = new google.maps.Polyline({
      path: snappedCoordinates,
      strokeColor: 'black',
      strokeWeight: 3
    });
  
    snappedPolyline.setMap(mapRef.current);
    setSnappedPolylines((prev)=> [...prev, ...snappedPolyline]);
  }
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
          onPolygonComplete={completePoly}/>  
          {
            markers
          }
          {res.max &&
            <ClusterInfo homes={res.markers} close={()=>{setRes([])}}/>
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
  const imgRef = useRef(null);
  const [date,] = useState(new Date(home["date"]));

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
              <img className="rotate border border-dark rounded" alt="test" src="../../rotate.png" onClick={()=>{setRotation(rotation + 90)}}/>
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