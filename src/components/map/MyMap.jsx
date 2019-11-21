import React, { useState, useEffect, useContext } from 'react'
import {
    MapBox,
    GoogleMapContext,
    InfoWindow,
    Polyline
  } from '@googlemap-react/core'
import MarkerClusterer from '@google/markerclustererplus'
import useUsers from '../hooks/useUsers';
import "./Map.css"

const CLUSTER_ID = "map-clusterer"

function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function DistanceBetweenCoords(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

const MyMap = ({markers, tracks}) => {
    const {state, dispatch} = useContext(GoogleMapContext);
    const [mapInit, setMapInit] = useState(false)
    const [click, setClick] = useState()
    const [infoWindow, setInfoWindow] = useState()
    const [driver, setDriver] = useState()
    const Users = useUsers()

    useEffect(()=>{
      if(click){ 
        var point = 0
        var min = 9999
        click.track.path.map(({latitude, longitude}, i)=>{
          let d = DistanceBetweenCoords(latitude, longitude, click.e.latLng.lat(), click.e.latLng.lng())
          if(d < min){
            min = d
            point = click.track.path[i]
          }
        })
        setInfoWindow({point, track: click.track})
        setDriver(Users.find((user)=>user._id === click.track.user))
      }
    },[click])

    useEffect(()=>{
      if(state.map){
        dispatch({type: "add_object", id: CLUSTER_ID, object: new MarkerClusterer(state.map, [], {
          maxZoom: 20,
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        })})
        setMapInit(true)
      }
    },[state.map])

    useEffect(()=>{
      if(state.map && mapInit && markers.length){
          const _ms = markers.map((marker)=>state.objects.has(marker.props.home._id) ? state.objects.get(marker.props.home._id) : null).filter((marker)=>!!marker)
          state.objects.get(CLUSTER_ID).clearMarkers()
          state.objects.get(CLUSTER_ID).addMarkers(_ms)
          state.objects.get(CLUSTER_ID).fitMapToMarkers()
      } else if(mapInit) {
        state.objects.get(CLUSTER_ID).clearMarkers()
      }
    },[markers.length, state.map, mapInit])

    return(
        <>
        <MapBox
          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          opts={{
            center: {lat: 36.737797, lng: -119.787125},
            zoom: 6,
            zoomControl: true,
          }}
          style={{
            height: '100%',
            width: '100%',
          }}
          useDrawing
          useGeometry
        />
        { markers.length > 0 &&
          markers
        }
        { tracks.length &&
          tracks.map((track, i)=>(
            <Polyline 
              id={track.id}
              key={i}
              opts={{
                strokeColor: track.color,
                path:track.line,
              }}
              onMouseOver={(e)=>setClick({e, track})}
              onMouseOut={()=>setTimeout(setClick, 200)}
            />
          ))
        }
        { !!infoWindow &&
          <InfoWindow visible={!!click} opts={click && {position: {lat: infoWindow.point.latitude, lng: infoWindow.point.longitude}}} onCloseClick={()=>setInfoWindow()}>
            <div><h3>Date: {new Date(infoWindow.track.date).toLocaleDateString()}</h3></div>
            <div><h3>Speed: {Math.round(infoWindow.point.speed * 2.237)}mph</h3></div>
            <div><h3>Driver: {driver.fName} {driver.lName}</h3></div>
          </InfoWindow>
        }
      </>
    )
}

export default MyMap