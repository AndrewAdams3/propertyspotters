import React, {useState, useEffect} from 'react';
import {Container, Col, Row} from 'react-bootstrap';

import EditAssModal from './EditAssModal'

export default function Dropdown({title, list, id, containerStyle, openState=false, complete, refresh, del}){
  
  const [open, setOpen] = useState(openState);
  const [show, setShow] = useState(false)
  const [subAss, setSubAss] = useState("");
  const [sub_comp, setSubComp] = useState(false);
  const edit = require('../config/images/edit.png');

  useEffect(()=>{
    setOpen(openState);
  }, [openState, refresh])

  return(
    <div className="p-1" style={containerStyle}>
      <EditAssModal show={show} title={title} comp={subAss.length ? sub_comp : complete} onHide={()=>{setShow(false); setSubAss(""); del()}} ass={id} subAss={subAss}/>
      <Row>
        <Col onClick={() => { setOpen(!open) }} style={{height: "100%", width:"100%", cursor: "pointer"}}>
          <h2 className="w-100" style={{ textAlign: "left", whiteSpace: "nowrap", position: "relative"}}>{title}
            <span style={{display: "inline", color: complete ? "green" : "red", verticalAlign:"bottom"}}>
              {complete ? " -complete!" : " -incomplete"}
            </span>
          </h2>
        </Col>
        <Col>
          <div className="edit-container">
            <img src={edit} alt="edit" className="edit-button" style={{display: "flex"}} onClick={(e)=>{ setShow(true)}}/>
          </div>
        </Col>
      </Row>
      <div style={{height: "100%"}}>
        <div>
          {
            open && list.map((item, index)=>{
              return(
                <h3 key={index} style={{textAlign: "center", position: "relative"}} key={item._id}>{item.address} 
                  <h4 style={{display:"inline", color: item.completed ? "green" : "red"}}>
                    {item.completed ? " -complete!" : " -incomplete"}
                  </h4>
                    <img src={edit} alt="edit" className="edit-button" style={{display: "flex"}} onClick={()=>{setShow(true); setSubAss(item._id); setSubComp(item.completed)}}/>
                </h3>
              )
            })
          }
          <hr style={{backgroundColor: "black"}}/>
        </div>
      </div>
    </div>
  )
}