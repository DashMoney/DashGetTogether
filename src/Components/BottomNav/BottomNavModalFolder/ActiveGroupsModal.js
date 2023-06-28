import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from 'react-bootstrap/CloseButton';

class ActiveGroupsModal extends React.Component {

  handleCloseClick = () => {
    this.props.hideModal();
  };

  render() {
    let modalBkg = "";
    let closeButtonColor;
    
    if(this.props.mode === "primary"){
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick}/>
    }else{
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} variant="white"/>
    }
    return (
      <>
        <Modal show={this.props.isModalShowing}
        contentClassName={modalBkg}>
        <Modal.Header >
          <Modal.Title>Active Groups</Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          <p>This modal will show groups that are larger than 10 and have been recently active, to allow users to find groups to join.</p>
          <p>This feature will be for DGT v2.0. The data contract is set up, the feature just needs to be implemented</p>
        </Modal.Body>

        <Modal.Footer>
        <Button variant="primary" onClick={this.handleCloseClick }>
              Close
            </Button>
        </Modal.Footer>
      </Modal>
      </> 
    );
  }
}

export default ActiveGroupsModal;
