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

  render() {
    const isLoggedIn = this.getLoginState();
    let loginButton;
    if(isLoggedIn) {
      loginButton = <button onClick={() => this.setLoginState(false)}>Log out</button>;
    } else {
      loginButton = <button onClick={()=>this.setState({loginModalStyle:{display: 'block'}})}>Log in</button>;
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
      <div className="modal-container" style={this.state.loginModalStyle}>
        <div className="modal-login">
          <button onClick={()=>this.setState({loginModalStyle:{display: 'none'}})}>X</button>
          <input type="text" placeholder="ID"/>
          <input type="password" placeholder="Password"/>
          <button>Log in</button>
        </div>
      </div>
      </nav>
      </>
    );
  }
}

export default Top;
