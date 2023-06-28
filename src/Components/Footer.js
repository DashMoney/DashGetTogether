import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className='footer' id="bodytext">
        <h3>
          Resources
        </h3>
        
        <ul>
        <li>Try out <span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashgetmoney.com">
            <b>DashGetMoney.com</b>
            </a>  and <span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashshoutout.com">
            <b>DashShoutOut.com</b>
            </a> to send and receive Dash or messages using just a name!
          </li>
          <li>DashMoney Github Repo - <a rel="noopener noreferrer" target="_blank" href="https://github.com/DashMoney">
            <b>https://github.com/DashMoney</b>
            </a></li>
          <li>
            <a rel="noopener noreferrer" target="_blank" href="https://dashplatform.readme.io/">
            Dash Platform Developer Documentation
            </a>
          </li>
          <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=VoQxHhzWhT0">
          DashMoney - Closing Loops (Video)
            </a></li>
        </ul>
      </div>
    );
  }
}
export default Footer;
