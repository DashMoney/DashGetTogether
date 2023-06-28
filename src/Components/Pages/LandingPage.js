import React from "react";
import DGTPreview from "../../Images/DGTPreview.png";
import Image from "react-bootstrap/Image";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Figure from 'react-bootstrap/Figure';

import "./LandingPage.css";

class LandingPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response : {},
      copiedMnemonic: false,
      //I dont think I need this
    }
  }
  render() {
    return (
      <>
      
      <h5 id="title-bar">
          <b>Create groups, invite and chat with others. Welcome to Dash Platform.</b>
        </h5>
      
        <div className="heading-shift">
          <p>
            <b>DashGetTogether is a  group messenger dapp with a very open architecture, hope you enjoy!
            </b> 
          </p>
        </div>
        

         <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">

         <Image
           fluid  rounded id="dash-landing-page" src={DGTPreview} alt="DGT Landing Page" 
         />

         <p></p>
         <Figure.Caption>
           <b>DashGetTogether - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
   <p></p>

<div id="bodytext">

        <h3>
          How to Use
          
        </h3>

        <div className="paragraph-shift">
         
            <h6>
              Connect your Wallet at the bottom of your screen, and you can start using DashGetTogether. </h6>

              {/* <h6> The DashShoutOut
              runs entirely in your browser and is purely a front end communicating with the Dash
              Platform.
            </h6> */}

            <p>
               If you are new to Dash, you will need a Dash Name from <a rel="noopener noreferrer" target="_blank" href="https://dashgetnames.com/">
            <b>DashGetNames.com</b>
             </a> {/*or sign up with <b>DashPay</b>, just download the app on your phone. Signing up for DashPay will provide you with everything you need.*/} (Currently, this is all 
              working on Testnet, so it is not real Dash.)
            </p>
          

        </div>
      </div>
      </>
    );
  }
}

export default LandingPage;
