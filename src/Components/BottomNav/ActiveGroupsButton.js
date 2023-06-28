import React from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";

class ActiveGroupsButton extends React.Component {
  render() {
    let buttonColor;

    if (this.props.mode === "dark") {
      buttonColor = "primary";
    } else {
      buttonColor = "secondary";
    }

    return (
      <Nav.Item>
        <Nav.Link>
        {this.props.isLoadingRefresh ?
          <Button
            variant={buttonColor}
            disabled
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Active </div>
              <Badge bg="light" text="dark" pill>
               Groups
              </Badge>
            </div>
          </Button>
          :
          <Button
            variant={buttonColor}
            
            onClick={() => {
              this.props.showModal("ActiveGroupsModal");
            }}
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Active </div>
              <Badge bg="light" text="dark" pill>
               Groups
              </Badge>
            </div>
          </Button>
  }
        </Nav.Link>
        
      </Nav.Item>
    );
  }
}

export default ActiveGroupsButton;
