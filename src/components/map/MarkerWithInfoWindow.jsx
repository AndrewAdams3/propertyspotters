import React, { useState, useRef } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export const MarkerWithInfoWindow = React.memo(({ position, home, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef(null);
  const [date,] = useState(new Date(home["date"]));
  const onToggleOpen = () => { setIsOpen(!isOpen); };
  return (<Marker key={id} position={position} onClick={onToggleOpen} title={JSON.stringify(home)}>

    {(isOpen) &&
      <InfoWindow onCloseClick={onToggleOpen}>
        <div className="windowContainer">
          <div className="rotateContainer">
            <img className="rotate border border-dark rounded" alt="test" src="../../rotate.png" onClick={() => { setRotation(rotation + 90); }} />
          </div>
          <div className="info">
            <p style={{ textAlign: "center" }}>{home["address"]}</p>
            <p style={{ textAlign: "center" }}>{"Found " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</p>
          </div>
          <hr style={{ backgroundColor: "black", marginBottom: "2rem" }} />
          <div style={{ height: "200px", width: "90%" }}>
            <div className="imageContainer" style={{ transform: `rotate(${rotation}deg)`, justifyContent: "flex-start" }}>
              <img ref={imgRef} style={{ borderStyle: "solid", borderColor: "black", borderWidth: ".1rem", height: "100%", width: "100%" }} src={home["picturePath"]} alt="pic" />
            </div>
          </div>
          <p className="mt-5">Image Link: <br /><a href={home["picturePath"]} target="_blank" rel="noopener noreferrer">{home["address"]}</a></p>
        </div>
      </InfoWindow>}
  </Marker>);
}, (prev, next) => prev.home._id == next.home._id);
