import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function({show, close, no, yes}){
  return yes ? (
    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" dialogClassName="aModal" onHide={close} id="popup">
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={yes}>Yes</Button>
        <Button onClick={no}>No</Button>
      </Modal.Footer>
    </Modal>
  ) : null
}