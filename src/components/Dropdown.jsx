import React, {useState, useEffect} from 'react';

export default function Dropdown({title, list, containerStyle, openState=false, complete, refresh}){
  
  useEffect(()=>{
    setOpen(openState);
  }, [openState, refresh])

  const [open, setOpen] = useState(openState);
  
  return(
    <div className="p-1" style={containerStyle}>
      <div onClick={() => { setOpen(!open) }} style={{height: "100%", width:"100%", cursor: "pointer"}}>
        <h2 className="w-100" style={{ textAlign: "left", whiteSpace: "nowrap" }}>{title}<h3 style={{display: "inline", color: complete ? "green" : "red"}}>{complete ? " -complete!" : " -incomplete"}</h3></h2>
      </div>
      <div style={{height: "100%"}}>
        <div>
          {
            open && list.map((item, index)=>{
              return(
                <h3 key={index} style={{textAlign: "center"}}>{item.address} <h4 style={{display:"inline", color: item.completed ? "green" : "red"}}>{item.completed ? " -complete!" : " -incomplete"}</h4></h3>
              )
            })
          }
          <hr style={{backgroundColor: "black"}}/>
        </div>
      </div>
    </div>
  )
}