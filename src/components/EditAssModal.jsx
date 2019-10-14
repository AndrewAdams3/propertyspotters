import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import Axios from 'axios';

export default function EditAssModal(props){
  const { ass, title, subAss, onHide, comp } = props;
  const [Ass, setAss] = useState({});
  const [sass, setSubAss] = useState({})
  const [complete, setComplete] = useState(comp ? true : false);
  const [toDelete, setDelete] = useState(false);
  const [newAss, setNewAss] = useState("")
  const [date, setDate] = useState()
  const backbtn = require('../config/images/back.png');


  useEffect(()=>{
    Axios.get(`${process.env.REACT_APP_SERVER}/data/assignments/one/byId/${ass}`)
    .then(({data})=>{
        if(data){
            setAss(data);
            if(subAss.length){
              data.Addresses.forEach((add)=>{
                  if(add._id === subAss){
                      setSubAss(add);
                  }
                  return;
              })
          } else{
            setSubAss({})
          }
        }
    })
    setComplete(comp)
    return ()=>{
      setDelete(false)
      setComplete(false)
    }
  },[ass, subAss, comp])

  const confirm = () =>{
    if(toDelete){
      if(subAss.length){
        Axios.put(`${process.env.REACT_APP_SERVER}/data/assignments/deleteSubAssignment`, {
          id: ass,
          ass: subAss
        }).then(({data})=>{
          onHide()
        })
      } else {
        console.log("deleting", ass)
        Axios.delete(`${process.env.REACT_APP_SERVER}/data/assignments/deleteAssignment/${ass}`).then(({data})=>{
          console.log("res", data);
          onHide()
        })
      }
    } else {
        Axios.put(`${process.env.REACT_APP_SERVER}/data/assignments/update-assignment`, {
          id: ass,
          sub_id: subAss,
          date: date,
          completed: complete,
          newAss: newAss
        }).then(({data})=>{
          console.log("res", data)
          onHide()
        })
      }
  }
  
  const close = () =>{
    onHide()
  }

  return Ass && complete !== undefined ? (
    <>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" id="editModal">
        <Modal.Header closeButton>
          <div className="backcontainer border rounded-circle" onClick={onHide}>
              <img src={backbtn} alt="back" className="backbtn"/>
          </div>
            <h2 style={{textAlign:"center", width:"100%"}}>{subAss.length && sass.address ? `${title}-${sass.address}` : subAss.length ? `${title}-...` : title}</h2>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "80vh" }}>
          <Container>
            <Row className="show-grid">
              <Col>
                <Form onSubmit={(e)=>e.preventDefault()}>
                  <Form.Row>
                  {!subAss.length &&
                    <Form.Group as={Col} controlId="Date">
                        <Form.Label>Change Due date?</Form.Label>
                        <Form.Control type="date" onChange={(e)=>setDate(e.target.value)}/>
                    </Form.Group>
                  }
                    <Form.Group as={Col} xs={12}>
                      <Form.Label>Completed?</Form.Label> <br/>
                      <Form.Check type="checkbox" label="yes" inline checked={complete} defaultChecked={comp} onChange={()=>{setComplete(true)}}/>
                      <Form.Check type="checkbox" label="no" inline checked={!complete} defaultChecked={!comp} onChange={()=>{setComplete(false)}}/>
                    </Form.Group>
                    <Form.Group as={Col} xs={12}>
                      <Form.Label>Delete?</Form.Label> <br/>
                      <Form.Check type="checkbox" label="yes" inline checked={toDelete} onChange={()=>setDelete(true)}/>
                      <Form.Check type="checkbox" label="no" inline checked={!toDelete} onChange={()=>setDelete(false)}/>
                    </Form.Group>
                  </Form.Row>
                  {subAss.length ?
                    <Form.Row>
                      <Form.Group as={Col} controlId="text">
                          <Form.Label>Change the Assignment?</Form.Label>
                          <Form.Control type="text" onChange={(e)=>setNewAss(e.target.value)}/>
                      </Form.Group>
                    </Form.Row> : <></>
                  }
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "space-around"}}>
          <Button variant="success" type="button" onClick={confirm}>Confirm</Button>
          <Button onClick={close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : 
  (
    <>
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Loading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                <Row className="show-grid">
                    <Col xs={12} md={8}>
                    Waiting for user data...
                    </Col>
                </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}