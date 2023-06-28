import React from "react";
//import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import CreateGroupButton from "./CreateGroupButton";
import RefreshButton from "./RefreshButton";
import ActiveGroupsButton from "./ActiveGroupsButton";

import "./BottomNav.css";

class BottomNav extends React.Component {

  render() {

    return (
      <>
        <Navbar
        className="bottomNav"  bg={this.props.mode}
        variant={this.props.mode} fixed="bottom">
          
            
          <Nav  className="one-level-nav">
          
            <CreateGroupButton 
              isLoadingRefresh={this.props.isLoadingRefresh}
              mode={this.props.mode}
              showModal={this.props.showModal}
            />

            <RefreshButton 
            isLoadingRefresh={this.props.isLoadingRefresh}
              handleGetInvitesAndGetIdInfo={this.props.handleGetInvitesAndGetIdInfo}
              mode={this.props.mode}
              showModal={this.props.showModal}
            />


            <ActiveGroupsButton
            isLoadingRefresh={this.props.isLoadingRefresh}

              mode={this.props.mode}
              showModal={this.props.showModal}
            />

          </Nav>
          {/* </Navbar.Collapse> */}
          
         </Navbar>
      </>
    );
  }
}
export default BottomNav;
