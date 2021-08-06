import React from 'react';
import { Link } from 'react-router-dom';
import './Top.css';
import axios from 'axios';
import logo from './young&chilling-logos_transparent.png'

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginToSignup: false
    };
    this.setLoginState = props.setLoginState;
    this.getLoginState = props.getLoginState;
    this.changeLoginToSignup = this.changeLoginToSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
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

  handleLogin(e) {
    e.preventDefault();
    if(e.target.id.value.length<4 || e.target.pw.value.length<8) {
      window.alert('id length should be more than 3, password length should be more than 7');
    } else {
      axios.post('/login_process',
	{
	  id: e.target.id.value,
	  password: e.target.pw.value
	}
      ).then((res)=>{
	if(res.data.success) {
	  this.setLoginState(true);
	  document.cookie='sessionToken='+res.data.sessionToken+';';
	  window.alert('welcome, '+res.data.name);
	} else {
	  window.alert('Wrong id or password!');
	}
      }
      ).catch((e)=>{
	console.error(e);
      }
      );
    }
  }

  handleSignup(e) {
    e.preventDefault();
    if(e.target.id.value.length<4 || e.target.pw.value.length<8) {
      window.alert('id length should be more than 3, password length should be more than 7');
    } else if(e.target.pw.value !== e.target.repw.value) {
      window.alert('Password is not correspoding with repeated one!');
    } else {
      axios.post('/signup_process',
	{
	  id: e.target.id.value,
	  password: e.target.pw.value,
	  name: e.target.username.value
	}
      ).then((res)=>{
	if(res.data.success) {
	  window.alert('Success!');
	} else {
	  window.alert('ID is already existed');
	}
      }).catch((e)=>{
	console.error(e);
      });
    }
  }

  changeLoginToSignup (toSignup = false) {
    if(toSignup) {
      return (
	<>
        <button onClick={()=>this.handleModalScreen(false)}>X</button>
	<button onClick={()=>this.setState({loginToSignup: false})}>Back to Login</button>
	<form id="signup" onSubmit={this.handleSignup}>
          <input type="text" name="id" placeholder="ID"/>
          <input type="password" name="pw" placeholder="Password"/>
	  <input type="password" name="repw" placeholder="Repeat password"/>
	  <input type="text" name="username" placeholder="Username"/>
          <input type="submit" value="Sign up" />
	</form>
	</>
      );
    } else {
      return (
	<>
        <button onClick={()=>this.handleModalScreen(false)}>X</button>
	<form id="login" onSubmit={this.handleLogin}>
          <input type="text" name="id" placeholder="ID"/>
          <input type="password" name="pw" placeholder="Password"/>
          <input type="submit" value="Log in"/>
	</form>
	<button onClick={()=>this.setState({loginToSignup: true})}>Sign up</button>
	</>
      );
    }
  }

  render() {
    const isLoggedIn = this.getLoginState();
    const modalLogin = this.changeLoginToSignup(this.state.loginToSignup);
    let loginButton;
    if(isLoggedIn) {
      loginButton = <button onClick={() => this.setLoginState(false)}>Log out</button>;
    } else {
      loginButton = <button onClick={()=>{this.handleModalScreen(true);this.setState({loginToSignup: false});}}>Log in</button>;
    }

    return (
      <>
      <nav className="head">
        <Link to="/"><img src={logo} className="Top_logo"/></Link>
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
          {modalLogin}
        </div>
      </div>
      </>
    );
  }
}

export default Top;
