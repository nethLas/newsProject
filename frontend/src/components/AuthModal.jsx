import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function AuthModal(props) {
  return (
    <Modal
      {...props}
      style={{ textAlign: 'center' }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Check your inbox.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Complete Signup</h4>
        <p>
          Click the link we sent to {props.email} to complete your account
          set-up.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="dark" className="rounded-pill">
          ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AuthModal;
