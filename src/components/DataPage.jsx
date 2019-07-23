import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function({title, body, onHide, show}){
    const backbtn = require('../config/images/back.png');
    return(
        <Modal show={show} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" onHide={onHide} style={{height: "100%"}}>
            <Modal.Header style={{justifyContent: "center"}}>
                <div className="backcontainer border rounded-circle" onClick={onHide}>
                    <img src={backbtn} alt="back" className="backbtn"/>
                </div>
                <h1>{title}</h1>
            </Modal.Header>
            <Modal.Body style={{overflowY: 'auto', maxHeight: "80vh"}}>
                {body}
            </Modal.Body>
        </Modal>
    )
}