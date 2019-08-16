/* eslint-disable no-undef */

import React, { useState } from 'react'
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
      console.log(clickedMarkers);
    },
  }),
  withScriptjs,
  withGoogleMap,
)(({data, onMarkerClustererClick}) =>
  <GoogleMap
      defaultZoom={13}
      defaultCenter={{lat: 36.3079945, lng: -119.3231157}}>
      <MarkerClusterer
        onClick={onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
        minimumClusterSize={5}
      >
        {
          data.map((home, index) => {
            if (home["latitude"] !== 0) {
              return <MarkerWithInfoWindow position={new google.maps.LatLng(home["latitude"], home["longitude"])} home={home} key={home["_id"]} />
            }
            return null;
          })
        }
      </MarkerClusterer>
    </GoogleMap> 
);

const MarkerWithInfoWindow = ({position, home, id}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [date,] = useState(new Date(home["date"]));

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
          <div className="window" style={{height: "250px", width: "250px", maxHeight: "300px", maxWidth: "300px"}}>
            <div className="info">
              <p style={{ textAlign: "center" }}>{home["address"]}</p>
              <p style={{ textAlign: "center" }}>{"Found " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</p>
            </div>
            <hr style={{ backgroundColor: "black" }} />
            <div className="bg">
            <img style={{ transform: "rotate(90deg)", height: "200px", width: "250px"}} src={home["picturePath"]} alt="pic" />
            </div>
          </div>
        </InfoWindow>}
    </Marker>
  )
}

export default MyMap;