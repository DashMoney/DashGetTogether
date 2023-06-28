import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class MnemonicLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchedName: "",
      validated: true,
      validityCheck: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    //console.log(event.target.value);
    if (this.formValidate(event.target.value) === true) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: true,
      });
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: false,
      });
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    if (this.formValidate(event.target.validationCustom01.value)) {

      this.props.handleLoginwithMnem(event.target.validationCustom01.value);

      this.props.closeExpandedNavs();
      this.props.hideModal();
    } else {
      console.log(`Invalid Mnemonic: ${event.target.validationCustom01.value}`);
    }
  };

  formValidate = (mnemonic) => {
    let regex = /^([a-z]+[ ]){11}[a-z]+$/m;
    let valid = regex.test(mnemonic);

    if (valid) {
      this.setState({
        searchedName: mnemonic,
      });
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <>
        <Form
          noValidate
          onSubmit={this.handleSubmitClick}
          onChange={this.onChange}
        >
          <Form.Group className="mb-3" controlId="validationCustom01">
            {/* <Form.Label>Log in/Sign up with Wallet Mnemonic</Form.Label> */}
            <Form.Control
              type="text"
              placeholder="Enter Mnemonic (12 word passphrase) here..."
              required
              isInvalid={!this.state.validityCheck}
              isValid={this.state.validityCheck}
            />

            <Form.Control.Feedback type="invalid">
              Please provide valid mnemonic
            </Form.Control.Feedback>
            
            <Form.Control.Feedback type="valid">
              Mnemonic looks good, so long as everything is spelled correctly.
            </Form.Control.Feedback>

            <p></p>

            {/* <Form.Text className="text-muted"> */}
            
              <ul>
                <li>
                  Signing in will query Dash Platform for your Identity and your DashShoutOut Documents (Messages). 
                </li>
                <li>
                  Additionally, you will be able to write messages for everyone to see and tag other users with messages. It is a very simple Dapp, but I hope you enjoy!
                </li>

                
              </ul>
            
            {this.state.validityCheck && !this.state.isLoading ? (
                <>
                  <p> </p>
                  <Button variant="primary" type="submit">
                    Connect Wallet
                  </Button>
                </>
              ) : (
                <Button disabled variant="primary" type="submit">
                  Connect Wallet
                </Button>
              )}

              {/* <Form.Text className="text-muted">
                <p></p>
                <h5>Experimental Feature - Platform Only Login</h5>
                <p>By not syncing the full wallet, the login is much faster! And the only functionality you lose for this Dapp is the Topup ability.</p>
                <p>Please let me know what you think of the feature and if its faster for you.</p>
                </Form.Text> */}
          </Form.Group>
          

          {/* <Button variant="primary" type="submit">
            Login with Mnemonic
          </Button> */}
        </Form>
      </>
    );
  }
}

export default MnemonicLogin;
