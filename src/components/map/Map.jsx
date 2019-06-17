/* eslint-disable no-undef */

import React, { useState } from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import './Map.css';
const MapWithMarkers = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.GOOGLE_API_KEY + "&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `87vh`, width: `90vw` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={new google.maps.LatLng(36.3079945, -119.3231157)}>
    {
      props.data.reduce(function (markers, home) {
        if (home["latitude"] !== 0) {
          var marker = <MarkerWithInfoWindow position={new google.maps.LatLng(home["latitude"], home["longitude"])} home={home} />
          markers.push(marker);
        }
        return markers;
      }, [])
    }
  </GoogleMap>
);

const MarkerWithInfoWindow = ({home, position}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [date, setDate] = useState(new Date(home["date"]));

  const onToggleOpen = () => { setIsOpen(!isOpen);}
  const onMouseover = () => { if (!isOpen) setIsHover(false);}
  const onMouseOut = () => { if (!isOpen) setIsHover(false)}

  return (
    <Marker
      position={position}
      onClick={onToggleOpen}
      onMouseOver={onMouseover}
      onMouseOut={onMouseOut}>

      {(isOpen || isHover) &&
        <InfoWindow onCloseClick={onToggleOpen}>
          <div className="window">
            <div className="bg">
              <img className="img" src={home["picturePath"]} alt="pic" />
            </div>
            <div className="info">
              <p>{home["address"]}</p>
              <p>{"Found " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</p>
            </div>
          </div>
        </InfoWindow>}
    </Marker>
  )
}

export default MapWithMarkers;