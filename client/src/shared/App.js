import React from 'react';
import { setCookie, getCookie, deleteCookie } from '../jslib/cookieIO';
import axios from 'axios';
import './App.css';
import Top from './../components/Top.js';
import MainSection from './../components/mainSection.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isAdmin: false
    };

    this.setLoginState = this.setLoginState.bind(this);
    this.getLoginState = this.getLoginState.bind(this);
    this.isOnline = this.isOnline.bind(this);
  }

  setLoginState(login_succeed = false) {
    this.setState({isLogin: login_succeed});
  }

  getLoginState() {
    return this.state.isLogin;
  }

  isOnline() {
    var seToken = getCookie('sessionToken');
    axios.get('/isOnline_process',
      {
	header: {
	  'Authorization': seToken
	}
      })
    .then((res)=>{
      if(res.data.isOnline) {
        this.setLoginState(true);
        if(res.data.authority_level>1) {
          this.setState({isAdmin: true});
        }
      } else {
        deleteCookie('sessionToken');
      }
    })
    .catch((e)=> {
      deleteCookie('sessionToken');
      this.setLoginState(false);
    });
  }

  componentDidMount() {
    this.isOnline();
  }

  render() {
    return (
      <>
      <header>
        <Top setLoginState={this.setLoginState} getLoginState={this.getLoginState} isAdmin={this.state.isAdmin} isOnline={this.isOnline}/>
      </header>
      <section>
        <MainSection />
      </section>
      </>
    );
  }
}

export default App;
