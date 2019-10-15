import React, {useEffect, useState, useContext} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';

import './table.css'
import Context from './modalContext'

export default function EditModal(props){

  let { state, dispatch } = useContext(Context);
  const [isBool, setIsBool] = useState(state.field.bool ? true : false)
  const [change, setChange] = useState();
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(()=>{
    setChange(!state.db[state.field.name])
  }, [state])
  useEffect(()=>{
    setIsBool(state.field.bool)
  },[state.field.bool])
  
  const handleTFSubmit = () => {
    let ndb = state.db
    console.log("state fied", state.field.name)
    switch(state.field.name){
      case "vacant":
        ndb.vacant = change
        break
      case "burned":
        ndb.burned = change
        break
      case "boarded":
        ndb.boarded = change
        break;
      default:
        console.log("no case")
        return;
    }
    console.log("change", change);
    Axios.put(`${process.env.REACT_APP_SERVER}/data/drivebys/updateDB`, {
      id: state.db._id,
      field: state.field.name,
      update: change
    }).then(({data})=>{
      console.log("res", data)
      dispatch({type: "show", value: false})
      dispatch({type: "reset"})
    }).catch((err)=>{
      console.log("err", err)
      dispatch({type: "show", value: false})
      dispatch({type: "reset"})
    })
  }

  const handleTSubmit = () => {
    if(hasChanged) {
      console.log("change", change)
      let ndb = state.db
      state.field.name === "address" ? ndb.address = change : ndb.type = change

      Axios.put(`${process.env.REACT_APP_SERVER}/data/drivebys/updateDB`, {
        id: state.db._id,
        field: state.field.name,
        update: change
      }).then(({data})=>{
        console.log("res", data)
      }).catch((err)=>console.log("err", err))
      dispatch({type: "show", value: false})
      dispatch({type: "reset"})
    } else {
      dispatch({type: "show", value: false})
      dispatch({type: "reset"})
    }
  }

  return state.show ? (
    <div>
      <Modal show={state.show} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" id="popup" onHide={()=>{dispatch({type: "show", value: false}); dispatch({type: "reset"})}}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`Change ${state.field.name}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: "10rem" }}>
          <Container>
            <Row className="show-grid">
              <Col sm={12}>
                <Form onSubmit={(e)=>e.preventDefault()}>
                    {
                      (isBool) &&
                      <h3>Change to {state.db[state.field.name] ? "false" : "true"}?</h3>
                    }

                  { state.field.name === "type" &&
                    <Form.Row>
                    <Form.Group>
                      <Form.Label as="legend" column sm={12}>
                        New Type
                      </Form.Label>
                      <Col sm={12}>
                        <Form.Check
                          type="radio"
                          label="Single-Family Residence"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios1"
                          onChange={()=>setChange("SFR")}
                        />
                        <Form.Check
                          type="radio"
                          label="Multi-Family Residence"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios2"
                          onChange={()=>setChange("MFR")}
                        />
                        <Form.Check
                          type="radio"
                          label="Lot"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios3"
                          onChange={()=>setChange("Lot")}
                        />
                        <Form.Check
                          type="radio"
                          label="Commercial"
                          name="formHorizontalRadios"
                          id="formHorizontalRadios4"
                          onChange={()=>setChange("COM")}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Row>
                  }
                  { state.field.name==="address" &&
                    <Form.Row>
                      <Form.Group>
                        <Form.Control type="text" defaultValue={state.field.value} onChange={(e)=>{setChange(e.nativeEvent.target.value); setHasChanged(true)}}/>
                      </Form.Group>
                    </Form.Row>
                  }
                  
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "space-around"}}>
          <Button variant="success" type="button" onClick={isBool ? handleTFSubmit : handleTSubmit}>Confirm</Button>
          <Button onClick={()=>dispatch({type: "show", value: false})}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) : 
  (
      <div>
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
                  Waiting for data...
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>dispatch({type: "show", value: false})}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}