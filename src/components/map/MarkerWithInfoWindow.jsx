import React, { useState, useRef } from 'react'
import {Marker, InfoWindow} from '@googlemap-react/core'

export default ({position, home}) => {
  const [infoDisplay, setInfoDisplay] = useState(false)

  const decoratedContent = (home) => infoDisplay ? `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-around; max-height: 15rem; max-width: 15rem">
      <strong style="font-size: calc(12px + 0.8vh); text-align: center; padding: 0 0 5px 0;">
        <h3 style="text-align: center; font-size: 1em">${home.address}</h3>
      </strong>
      <p>Found: ${new Date(home.date).toLocaleDateString()}</p>
      <img src=${home.picturePath} alt="image link" width="100px" />
      <a href="${home.picturePath}" target="_blank" rel="noopener noreferrer" style="text-align: center">Link to Image</a>
    </div>
  ` : ""

  // Set handlers
  const handleClick = () => {
    setInfoDisplay(!infoDisplay)
  }

  return (
    <>
      <Marker
        id={home._id}
        opts={{
          position: position,
        }}
        onClick={handleClick}
      />
      <InfoWindow
        anchorId={home._id}
        opts={{
          content: decoratedContent(home),
        }}
        visible={infoDisplay}
        onCloseClick={() => {
          setInfoDisplay(false)
        }}
      />
    </>
  )
}