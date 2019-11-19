import React, { useState, useEffect, useContext } from 'react'
import {
    MapBox,
    GoogleMapContext
  } from '@googlemap-react/core'

const MapContainer = ({markers}) => {
    const [center, setCenter] = useState()
    console.log("test", GoogleMapContext)
    const [state, dispatch] = useContext(GoogleMapContext);

    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
        script.async = true;
    
        document.body.appendChild(script);

        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(position =>
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            , ()=>{
                setCenter({lat: 36.737797, lng: -119.787125})
            })
    }, [])

    useEffect(()=>{
        console.log("mar", markers)
        //var markerCluster = new window.google.maps.MarkerClusterer(markers);
        // markerCluster.setMap(state.ma)
    },[markers.length])

    return(
        <>
        <MapBox
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        opts={{
          center: center,
          zoom: 16,
          zoomControl: true
        }}
        style={{
          height: '100%',
          width: '100%',
        }}
        useDrawing
        useGeometry
        usePlaces
        onZoomChanged={()=>console.log("zoom")}
        onCenterChanged={() => {
          console.log('The center of the map has changed.')
        }}
      />
      { markers.length > 0 &&
         markers
      }
      </>
    )
}

export default MapContainer