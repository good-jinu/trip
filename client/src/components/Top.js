import React from 'react';
import { Link } from 'react-router-dom';
import './Top.css';

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalStyle: {display: 'none'}
    };
    this.setLoginState = props.setLoginState;
    this.getLoginState = props.getLoginState;
  }

  handleModalScreen(opening=false) {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal-container");

    if(opening) {
      body.style.overflow="hidden";
      modal.style.display="flex";
    } else {
      body.style.overflow="auto";
      modal.style.display="none";
    }
  }

  render() {
    const isLoggedIn = this.getLoginState();
    let loginButton;
    if(isLoggedIn) {
      loginButton = <button onClick={() => this.setLoginState(false)}>Log out</button>;
    } else {
      loginButton = <button onClick={()=>this.handleModalScreen(true)}>Log in</button>;
    }

    return (
      <>
      <nav className="head">
      <div className="Top_logo">
        <Link to="/">LOGO</Link>
      </div>
      <div className="SearchBox">
        <input type="text"/>
        <button>search</button>
      </div>
      <div className="MenuBox">
        <button>Menu</button>
        {loginButton}
      </div>
      </nav>
      <div className="modal-container">
        <div className="modal-login">
          <button onClick={()=>this.handleModalScreen(false)}>X</button>
          <input type="text" placeholder="ID"/>
          <input type="password" placeholder="Password"/>
          <button>Log in</button>
        </div>
      </div>
      </>
    );
  }
}

export default Top;
